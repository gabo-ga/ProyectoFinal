from django.shortcuts import render
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import connection
from django.core.exceptions import ValidationError
from django.db.models import Count, Q
from rest_framework.viewsets import ViewSet
#queries
from .queries import (contar_pedidos, contar_vehiculos, obtener_pedidos_en_curso, 
                      obtener_pedidos_entregados, contar_pedidos_cancelados, contar_pedidos_entregados, 
                      obtener_vehiculos_disponibles, obtener_detalle_coordenadas, obtener_conductores, obtener_detalle_pedidos, actualizar_estado_pedido)

# Serializadores
from .serializer import ( UserSerializer, ClienteSerializer, PedidoSerializer, VehiculoSerializer,
                         ConfiguracionSerializer, AnalisisPedidoSerializer, UsuarioSerializer, UbicacionSerializer)

# Modelos
from .models import Cliente, Pedido, Vehiculo, Configuracion, AnalisisPedido, Usuario, Ubicacion, EstadoPedido


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {'message': 'Esta es una vista protegida'}
        return Response(data)

class UsuarioViewSet(viewsets.ModelViewSet):

    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [AllowAny]
    #accion personalizada para traer los conductores
    @action(detail=False, methods=['get'], url_path='conductores')
    def obtener_conductores(self, request):
        conductores = obtener_conductores()
        return Response(conductores)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [IsAuthenticated]  
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Modificar los datos serializados para agregar el campo nombre_completo
        data = []
        for user_data in serializer.data:
            user_data["nombre_completo"] = f"{user_data['first_name']} {user_data['last_name']}"
            data.append(user_data)
        
        return Response(data)

#class ConductorViewSet(viewsets.ModelViewSet):
#    queryset = Conductor.objects.all()
#    serializer_class = ConductorSerializer
    #permission_classes = [IsAuthenticated]
#    def validate_pedido_por_conductor(conductor):
#        pedidos_activos = Pedido.objects.filter(conductor=conductor, estado__in=['pendiente', 'en_ruta']).count()
#        if pedidos_activos >= 4:
#            raise ValidationError("El conductor ya tiene el máximo de 4 pedidos activos asignados.")
    #accion personalizada para pedidos activos

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [AllowAny]  

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [AllowAny] 
    #action para pedidos en curso
    @action(detail=False, methods=['get'], url_path='en-curso')
    def pedidos_en_curso(self, request):
        try:
            result = obtener_pedidos_en_curso()
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    # action para pedidos entregados
    @action(detail=False, methods=['get'], url_path='entregados')
    def pedidos_entregados(self, request):
        try:
            result = obtener_pedidos_entregados()
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
        result = obtener_detalle_coordenadas(estado_id=1)
        return Response(result)
    #endpoint para contar pedidos cancelados
    @action(detail=False, methods=['get'], url_path='count-cancelados')
    def pedidos_cancelados(self, request):
        try:
            count = contar_pedidos_cancelados()
            return Response({"count": count})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    #endpoint para contar los pedidos entregados
    @action(detail=False, methods=['get'], url_path='count-entregados')
    def pedidos_entregados(self, request):
        try:
            count = contar_pedidos_entregados()
            return Response({"count": count})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
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
    #action para vehiculos disponibles
    @action(detail=False, methods=['get'], url_path='vehiculos-disponibles')
    def vehiculos_disponibles(self, request):
        vehiculos_disponibles = obtener_vehiculos_disponibles()

        return Response(vehiculos_disponibles)
    
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

class ConfiguracionViewSet(viewsets.ViewSet):
    serializer_class = ConfiguracionSerializer
    permission_classes = [AllowAny]

    def list(self, request):
        config, created = Configuracion.objects.get_or_create(id=1)
        serializer = self.serializer_class(config)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='obtener-origen')
    def obtener_origen(self, request):
        config, created = Configuracion.objects.get_or_create(id=1)
        serializer = self.serializer_class(config)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='guardar-origen')
    def guardar_origen(self, request):
        direccion_origen = request.data.get("direccion_origen")
        lat = request.data.get("lat")
        lng = request.data.get("lng")

        print("Datos recibidos - Dirección:", direccion_origen, "Lat:", lat, "Lng:", lng)

        # Verificar que lat y lng sean válidos
        try:
            lat = float(lat)
            lng = float(lng)
            print("Latitud y longitud convertidas a float:", lat, lng)
        except (TypeError, ValueError) as e:
            print("Error al convertir lat y lng a float:", e)
            return Response({"error": "Coordenadas inválidas. Asegúrate de enviar lat y lng como números válidos."}, status=400)

        # Intentar crear el Point
        try:
            punto_origen = Point(lng, lat, srid=4326)  # Crear el punto geográfico
            print("Punto de origen creado correctamente:", punto_origen)

            # Crear o actualizar la configuración
            configuracion, created = Configuracion.objects.update_or_create(
                id=1,
                defaults={
                    "direccion_origen": direccion_origen,
                    "punto_origen": punto_origen
                }
            )

            # Confirmar que el punto se haya guardado correctamente en la base de datos
            serializer = self.serializer_class(configuracion)
            return Response({
                "status": "Dirección de origen guardada",
                "data": serializer.data
            }, status=200)
        except Exception as e:
            print("Error al crear el punto de origen:", e)
            return Response({"error": "Error al crear el punto de origen"}, status=400)
  
  