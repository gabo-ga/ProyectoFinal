from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

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