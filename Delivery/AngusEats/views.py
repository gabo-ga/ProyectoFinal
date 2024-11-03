from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import connection

# Serializadores
from .serializer import UserSerializer, ClienteSerializer, PedidoSerializer, VehiculoSerializer, ConductorSerializer, VehiculoUbicacionSerializer, ConfiguracionSerializer

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

class ConductorViewSet(viewsets.ModelViewSet):
    queryset = Conductor.objects.all()
    serializer_class = ConductorSerializer

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
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.nombre AS cliente_nombre,
                    c.telefono AS cliente_telefono,
                    p.fecha_creacion AS pedido_fecha,
                    p.estado AS pedido_estado,
                    p.direccion_destino AS pedido_direccion_destino
                FROM 
                    "AngusEats_cliente" c
                JOIN 
                    "AngusEats_pedido" p
                ON 
                    c.id = p.cliente_id
                WHERE 
                    p.estado IN ('pendiente', 'en_ruta');
            """)
            
            rows = cursor.fetchall()
            
            result = [
                {
                    'cliente_nombre': row[0],
                    'cliente_telefono': row[1],
                    'pedido_fecha': row[2],
                    'pedido_estado': row[3],
                    'pedido_direccion_destino': row[4]
                }
                for row in rows
            ]
        return Response(result)
    
    # action para pedidos "entregados"
    @action(detail=False, methods=['get'], url_path='entregados')
    def pedidos_entregados(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.nombre AS cliente_nombre,
                    c.telefono AS cliente_telefono,
                    p.fecha_creacion AS pedido_fecha,
                    p.estado AS pedido_estado,
                    p.direccion_destino AS pedido_direccion_destino
                FROM 
                    "AngusEats_cliente" c
                JOIN 
                    "AngusEats_pedido" p
                ON 
                    c.id = p.cliente_id
                WHERE 
                    p.estado = 'entregado';
            """)
            
            rows = cursor.fetchall()
            
            result = [
                {
                    'cliente_nombre': row[0],
                    'cliente_telefono': row[1],
                    'pedido_fecha': row[2],
                    'pedido_estado': row[3],
                    'pedido_direccion_destino': row[4]
                }
                for row in rows
            ]
        return Response(result)
    
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
                "AngusEats_pedido"."id" AS "ID",
                ST_X("AngusEats_pedido"."coordenadas_origen") AS "ORIGEN_LAT",
                ST_Y("AngusEats_pedido"."coordenadas_origen") AS "ORIGEN_LNG",
                ST_X("AngusEats_pedido"."coordenadas_destino") AS "DESTINO_LAT",
                ST_Y("AngusEats_pedido"."coordenadas_destino") AS "DESTINO_LNG"
                    FROM
                "AngusEats_pedido";
                """)

            rows = cursor.fetchall()
            columnas = [col[0] for col in cursor.description]

            result = [
                dict(zip(columnas, row))
                for row in rows
            ]

        return Response(result)

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
    
class ConfiguracionViewSet(viewsets.ViewSet):
    serializer_class = ConfiguracionSerializer

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
        config, created = Configuracion.objects.get_or_create(id=1)
        serializer = self.serializer_class(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "Dirección de origen guardada", "data": serializer.data})
        return Response(serializer.errors, status=400)
    