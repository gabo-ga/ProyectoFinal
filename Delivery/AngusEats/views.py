from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db import connection

# Serializadores
from .serializer import UserSerializer, ClienteSerializer, PedidoSerializer, VehiculoSerializer, ConductorSerializer, VehiculoUbicacionSerializer

# Modelos
from .models import Cliente, Pedido, Vehiculo, Conductor


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