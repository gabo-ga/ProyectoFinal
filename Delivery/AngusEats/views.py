from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User

# Serializadores
from .serializer import UserSerializer, ClienteSerializer, PedidoSerializer, VehiculoSerializer

# Modelos
from .models import Cliente, Pedido, Vehiculo


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {'message': 'Esta es una vista protegida'}
        return Response(data)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [IsAuthenticated]  


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