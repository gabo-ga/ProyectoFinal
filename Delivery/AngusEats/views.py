from django.shortcuts import render
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from rest_framework import status, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.db import connection
from django.core.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from django.utils.dateparse import parse_datetime
#queries
from .queries import (contar_pedidos, contar_vehiculos, obtener_pedidos_en_curso,  
                      obtener_vehiculos_disponibles, obtener_detalle_coordenadas, obtener_conductores, obtener_detalle_pedidos, actualizar_estado_pedido, obtener_analisis_pedidos)

# Serializadores
from .serializer import ( #UserSerializer, 
                         LoginSerializer,
                         ClienteSerializer, PedidoSerializer, VehiculoSerializer,
                         ConfiguracionSerializer, AnalisisPedidoSerializer, UsuarioSerializer, UbicacionSerializer)

# Modelos
from .models import Cliente, Pedido, Vehiculo, Configuracion, AnalisisPedido, Usuario, Ubicacion, EstadoPedido
    
class LoginView(APIView):
    """
    LoginView maneja la autenticación de usuarios.
    Métodos:
        post(request):
            Autentica a un usuario basado en el nombre de usuario y contraseña proporcionados.
            Devuelve una respuesta con tokens de acceso y refresco si la autenticación es exitosa.
            Devuelve una respuesta de error si la autenticación falla.
    Atributos:
        Ninguno
    """
    permission_classes = [AllowAny]
    def post(self,request):
        usuario = request.data.get('usuario')
        password = request.data.get('password')
        
        user = authenticate(username=usuario, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                "access_token": access_token,
                "refresh_token": str(refresh),
                "user_id": user.id,
                "username": user.usuario,
                "rol": user.rol,
            }, status=status.HTTP_200_OK)
        return Response({"error": "Usuario o contraseña incorrectos"}, status=status.HTTP_401_UNAUTHORIZED)
            

class LogoutView(APIView):
    """
    LogoutView maneja el proceso de cierre de sesión de usuario.

    Métodos:
        post(request):
            Cierra la sesión del usuario y devuelve un mensaje de éxito.

            Args:
                request (Request): El objeto de solicitud HTTP.

            Returns:
                Response: Un objeto de respuesta que contiene un mensaje de éxito y el código de estado HTTP 200.
    """
    def post(self, request):
        logout(request)
        return Response({"message": "Usuario deslogueado"}, status=status.HTTP_200_OK)

class UsuarioViewSet(viewsets.ModelViewSet):

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    #accion personalizada para traer los conductores
    @action(detail=False, methods=['get'], url_path='conductores')
    def obtener_conductores(self, request):
        conductores = obtener_conductores()
        return Response(conductores)

class ClienteViewSet(viewsets.ModelViewSet):
    """
    Un viewset para ver y editar instancias de Cliente.

    Atributos:
        queryset (QuerySet): El conjunto de consultas que recupera todos los objetos Cliente.
        serializer_class (Serializer): La clase de serializador utilizada para serializar y deserializar objetos Cliente.
        permission_classes (list): La lista de clases de permisos que determinan el acceso a este viewset.
    """
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [AllowAny]  

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.select_related('cliente', 'conductor', 'origen', 'destino', 'estado')
    serializer_class = PedidoSerializer
    permission_classes = [AllowAny] 
    #accion personalizada para pedidos en curso 
    @action(detail=False, methods=['get'], url_path='en-curso')
    def pedidos_en_curso(self, request):
        try:
            conductor_id = request.query_params.get('conductor_id', None)
            estado = request.query_params.get('estado', None)
            
            result = obtener_pedidos_en_curso(conductor_id=conductor_id, estado=estado)
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    #endpoint para orderlist
    @action(detail=False, methods=['get'], url_path='detalle-pedidos')
    def detalle_pedidos(self, request):
        try:
            result = obtener_detalle_pedidos()
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    #endpoint para coordendas
    @action(detail=False, methods=['get'], url_path='coordenadas')
    def detalle_coordenadas(self, request):
        conductor_id = request.query_params.get('conductor_id', None)
        result = obtener_detalle_coordenadas(estado_id=1, conductor_id= conductor_id)
        return Response(result)    
    
    @action(detail=False, methods=['post'], url_path='calcular-ruta-con-parada')
    def calcular_ruta_con_parada(self, request):
        origen_lat = request.data.get("origen_lat")
        origen_lng = request.data.get("origen_lng")
        destino_final_lat = request.data.get("destino_final_lat")
        destino_final_lng = request.data.get("destino_final_lng")

        # Verificar que todos los datos están presentes
        if None in (origen_lat, origen_lng, destino_final_lat, destino_final_lng):
            return Response({"error": "Datos incompletos"}, status=400)

        # Crear los puntos geográficos
        origen = Point(float(origen_lng), float(origen_lat), srid=4326)
        destino_final = Point(float(destino_final_lng), float(destino_final_lat), srid=4326)

        # Filtrar los pedidos pendientes y calcular la distancia al origen
        destino_mas_cercano = Pedido.objects.filter(estado='pendiente').annotate(
            distancia=Distance("coordenadas_destino", origen)
        ).order_by("distancia").first()

        if not destino_mas_cercano:
            return Response({"error": "No hay destinos disponibles"}, status=404)

        # Preparar la respuesta con el destino más cercano y el destino final
        data = {
            "origen": {"lat": origen.y, "lng": origen.x},
            "destino_mas_cercano": {
                "lat": destino_mas_cercano.coordenadas_destino.y,
                "lng": destino_mas_cercano.coordenadas_destino.x,
            },
            "destino_final": {"lat": destino_final.y, "lng": destino_final.x},
        }

        return Response(data, status=200)
    #endpoint para actualiza el estado de un pedido
    @action(detail=True, methods=['patch'], url_path='actualizar-estado')
    def actualizar_estado(self, request, pk=None):
        nuevo_estado_id = request.data.get('estado_id')

        # Validar si el estado_id existe en la tabla EstadoPedido
        try:
            nuevo_estado = EstadoPedido.objects.get(id=nuevo_estado_id)
        except EstadoPedido.DoesNotExist:
            return Response({"error": f"Estado inválido con ID: {nuevo_estado_id}"}, status=status.HTTP_400_BAD_REQUEST)

        # Intentar actualizar el estado
        try:
            actualizar_estado_pedido(pk, nuevo_estado.id)
            return Response({"mensaje": "Estado actualizado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    #endpoint para editar pedidos
    @action(detail=True, methods=["patch"], url_path="editar")
    def editar_pedido(self, request, pk=None):
        
        try:
            pedido = self.get_object()

            serializer = PedidoSerializer(pedido, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Pedido actualizado exitosamente", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"error": "Datos inválidos", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Pedido.DoesNotExist:
            return Response(
                {"error": "Pedido no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )
    
    #contar pedidos dinamicamente
    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request):
        estado_ids = request.query_params.get('estado', None)

        if estado_ids:
            # Convertir el parámetro en una lista de IDs enteros
            estado_ids = [int(id_estado) for id_estado in estado_ids.split(',')]
        else:
            return Response({"error": "Debe proporcionar al menos un estado."}, status=400)

        pedidos_contados = contar_pedidos(estado_ids=estado_ids)
        return Response({"count": pedidos_contados})

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [AllowAny] 

    #accion para contar vehiculos    
    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request):
        disponible = request.query_params.get('disponible', None)
        if disponible is not None:
            disponible = disponible.lower() == 'true'
        total_vehiculos = contar_vehiculos(disponible=disponible)
        return Response({"count": total_vehiculos})   

class AnalisisPedidoViewSet(viewsets.ModelViewSet):
    queryset = AnalisisPedido.objects.all()
    serializer_class = AnalisisPedidoSerializer
    permission_classes = [AllowAny]  
    
    @action(detail=False, methods=['get'])
    def rango_fechas(self, request):
        fecha_inicio_str = request.query_params.get('fecha_inicio', None)
        fecha_fin_str = request.query_params.get('fecha_fin', None)
        
        if not fecha_inicio_str or not fecha_fin_str:
            return Response({
                "error": "Debe proporcionar fecha_inicio y fecha_fin"
            }, status=400)
        
        try:
            fecha_inicio = parse_datetime(fecha_inicio_str)
            fecha_fin = parse_datetime(fecha_fin_str)
            
            if not fecha_inicio or not fecha_fin:
                return Response({
                    "error": "Formato de fecha inválido"
                }, status=400)
            
            resultado = obtener_analisis_pedidos(fecha_inicio, fecha_fin)
            
            if not resultado:
                return Response({
                    "error": "No se encontraron registros para el período especificado"
                }, status=404)
            
            return Response(resultado)
            
        except Exception as e:
            return Response({
                "error": f"Error al procesar la solicitud: {str(e)}"
            }, status=500)

    
    
class UbicacionViewSet(viewsets.ModelViewSet):
    queryset = Ubicacion.objects.all()
    serializer_class = UbicacionSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'], url_path='buscar')
    def buscar_por_direccion(self, request):
        direccion = request.query_params.get('direccion', None)
        if not direccion:
            return Response(
                {"error": "Debe proporcionar un parámetro de dirección."},
                status=400
            )

        ubicaciones = Ubicacion.objects.filter(direccion__icontains=direccion)
        serializer = self.get_serializer(ubicaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='destino')
    def obtener_destino(self, request, pk=None):
        try:
            ubicacion = self.get_object()
            serializer = self.get_serializer(ubicacion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Ubicacion.DoesNotExist:
            return Response(
                {"error": "Destino no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )


class ConfiguracionViewSet(viewsets.ModelViewSet):
    queryset = Configuracion.objects.all()
    serializer_class = ConfiguracionSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['patch'], url_path='guardar-origen')
    def guardar_origen(self, request):
        config, _ = Configuracion.objects.get_or_create(id=1)

        serializer = self.get_serializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "Direccion de origen guardada",
                "data" : serializer.data
            }, status=200)
        return Response(serializer.errors, status=400)

