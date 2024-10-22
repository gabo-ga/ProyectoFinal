from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
#serializar para usuario
from .serializer import UserSerializer
from django.contrib.auth.models import User
##import cliente
from .models import Cliente
from .serializer import ClienteSerializer
#import para pedido
from .models import Pedido
from .serializer import PedidoSerializer

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {'message': 'Esta es una vista protegida'}
        return Response(data)
    
    
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all() 
    serializer_class = UserSerializer
    
    
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    
class PedidoCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PedidoSerializer(data=request.data)
        
        if serializer.is_valid():
            # Guardar el nuevo pedido en la base de datos
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)