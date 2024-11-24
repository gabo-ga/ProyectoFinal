from django.shortcuts import render
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import connection
from django.core.exceptions import ValidationError
from django.db.models import Count, Q
from rest_framework.viewsets import ViewSet
#queries
from .queries import contar_pedidos, contar_vehiculos, obtener_pedidos_en_curso, obtener_pedidos_entregados, contar_pedidos_cancelados, contar_pedidos_entregados

# Serializadores
from .serializer import UserSerializer, ClienteSerializer, PedidoSerializer, VehiculoSerializer, ConductorSerializer, VehiculoUbicacionSerializer, ConfiguracionSerializer, ConductorRutasSerializer

# Modelos
from .models import Cliente, Pedido, Vehiculo, Conductor, Configuracion


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {'message': 'Esta es una vista protegida'}
        return Response(data)

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

class ConductorViewSet(viewsets.ModelViewSet):
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer
    #permission_classes = [IsAuthenticated]
    def validate_pedido_por_conductor(conductor):
        pedidos_activos = Pedido.objects.filter(conductor=conductor, estado__in=['pendiente', 'en_ruta']).count()
        if pedidos_activos >= 4:
            raise ValidationError("El conductor ya tiene el máximo de 4 pedidos activos asignados.")
    #accion personalizada para pedidos activos
    @action(detail=False, methods=['get'], url_path='con-activos')
    def conductores_con_pedidos(self, request):
        conductores = Conductor.objects.annotate(
            pedidos_activos=Count('pedido', filter=Q(pedido__estado__in=['pendiente', 'en_ruta']))
        )
        serializer = ConductorSerializer(conductores, many=True)
        return Response(serializer.data)
    #accion para rutas asignadas
    
class ConductorRutasViewSet(ViewSet):
    """
    Endpoint que devuelve información de los conductores y sus rutas.
    """

    def list(self, request):
        conductores = Conductor.objects.all()
        serializer = ConductorRutasSerializer(conductores, many=True)
        return Response(serializer.data)
    

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    #permission_classes = [IsAuthenticated]  

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    #permission_classes = [IsAuthenticated] 
    #action para pedidos en curso
    @action(detail=False, methods=['get'], url_path='en-curso')
    def pedidos_en_curso(self, request):
        try:
            result = obtener_pedidos_en_curso()
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
        # action para pedidos "entregados"
    @action(detail=False, methods=['get'], url_path='entregados')
    def pedidos_entregados(self, request):
        try:
            result = obtener_pedidos_entregados()
            return Response(result)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    #CONSULTA SQL PARA ORDERLIST
    @action(detail=False, methods=['get'], url_path='detalle-pedidos')
    def detalle_pedidos(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                  "AngusEats_pedido"."id" AS "ID",
                  "AngusEats_cliente"."nombre" AS "CLIENTE",
                  "AngusEats_pedido"."estado" AS "ESTADO",
                  TO_CHAR("AngusEats_pedido"."fecha_entrega", 'HH24:MI:SS') AS "HORA_ESTIMADA",
                  "AngusEats_pedido"."direccion_destino" AS "DIRECCION_DESTINO"
                FROM
                  "AngusEats_pedido"
                INNER JOIN
                  "AngusEats_cliente" ON "AngusEats_pedido"."cliente_id" = "AngusEats_cliente"."id";
            """)

            rows = cursor.fetchall()
            columnas = [col[0] for col in cursor.description]

            result = [
                dict(zip(columnas, row))
                for row in rows
            ]

        return Response(result)
    
    # CONSULTA SQL PARA DETALLE DE COORDENADAS CON DECODIFICACIÓN SRID
    @action(detail=False, methods=['get'], url_path='coordenadas')
    def detalle_coordenadas(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    p.id AS "ID",
                    ST_X(p.coordenadas_origen) AS "ORIGEN_LAT",
                    ST_Y(p.coordenadas_origen) AS "ORIGEN_LNG",
                    ST_X(p.coordenadas_destino) AS "DESTINO_LAT",
                    ST_Y(p.coordenadas_destino) AS "DESTINO_LNG"
                FROM 
                    "AngusEats_pedido" p
                WHERE 
                    p.estado IN ('pendiente', 'en_ruta');
                """)

            rows = cursor.fetchall()
            columnas = [col[0] for col in cursor.description]

            result = [
                dict(zip(columnas, row))
                for row in rows
            ]

        return Response(result)
    
    @action(detail=False, methods=['get'], url_path='count-cancelados')
    def pedidos_cancelados(self, request):
        try:
            count = contar_pedidos_cancelados()
            return Response({"count": count})
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
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
    
    @action(detail=True, methods=['patch'], url_path='actualizar-estado')
    def actualizar_estado(self, request, pk=None):
        nuevo_estado = request.data.get('estado')
        if nuevo_estado not in ['entregado', 'cancelado']:
            return Response({"error": "Estado inválido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE "AngusEats_pedido" 
                    SET estado = %s 
                    WHERE id = %s
                """, [nuevo_estado, pk])
            return Response({"mensaje": "Estado actualizado correctamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request):
        estado = request.query_params.get('estado', None)
        pedidos_contados = contar_pedidos(estado=estado)
        return Response({"count": pedidos_contados})

class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    #permission_classes = [IsAuthenticated] 
       # Acción personalizada para devolver solo la ubicación geográfica
    @action(detail=False, methods=['get'], url_path='ubicaciones')
    def ubicaciones(self, request):
        vehiculos = self.get_queryset()
        ubicaciones = []

        for vehiculo in vehiculos:
            if vehiculo.ubicacion_geografica:
                ubicaciones.append({
                    'placa': vehiculo.placa,
                    'ubicacion_geografica': {
                        'latitude': vehiculo.ubicacion_geografica.y,
                        'longitude': vehiculo.ubicacion_geografica.x
                    }
                })

        return Response(ubicaciones)
    #action para vehiculos disponibles
    @action(detail=False, methods=['get'], url_path='vehiculos-disponibles')
    def vehiculos_disponibles(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    v.placa AS vehiculo_placa,
                    v.vehiculo_nombre AS vehiculo_nombre,
                    v.tipo AS vehiculo_tipo,
                    v.disponible AS vehiculo_disponible,
                    c.nombre AS conductor_nombre,
                    c.telefono AS conductor_telefono
                FROM 
                    "AngusEats_vehiculo" v
                JOIN 
                    "AngusEats_conductor" c
                ON 
                    v.conductor_id = c.id
                WHERE 
                    v.disponible = TRUE;
            """)

            rows = cursor.fetchall()

            # Estructurar los datos en formato JSON
            vehiculos_disponibles = [
                {
                    'placa': row[0],
                    'vehiculo_nombre': row[1],
                    'vehiculo_tipo': row[2],
                    'disponible': row[3],
                    'conductor_nombre': row[4],
                    'conductor_telefono': row[5]
                }
                for row in rows
            ]

        return Response(vehiculos_disponibles)
    
    @action(detail=False, methods=['get'], url_path='count')
    def count(self, request):
        disponible = request.query_params.get('disponible', None)
        if disponible is not None:
            disponible = disponible.lower() == 'true'
        total_vehiculos = contar_vehiculos(disponible=disponible)
        return Response({"count": total_vehiculos})
    
class ConfiguracionViewSet(viewsets.ViewSet):
    serializer_class = ConfiguracionSerializer
    #permission_classes = [IsAuthenticated]

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
  
  