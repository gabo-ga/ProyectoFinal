from rest_framework import serializers
from .models import Cliente
from django.contrib.auth.models import User
from .models import Pedido

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        
  
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'telefono']
    

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = [
            'id', 
            'cliente', 
            'direccion_origen', 
            'direccion_destino', 
            'estado', 
            'fecha_creacion', 
            'fecha_entrega', 
            'precio', 
            'ruta'
        ]
        read_only_fields = ['fecha_creacion']