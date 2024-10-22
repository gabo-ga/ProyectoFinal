from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Pedido, Vehiculo, Cliente
from django.contrib.gis.geos import Point

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
        
class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = ['id', 'vehiculo_nombre', 'tipo', 'ubicacion_geografica', 'conductor', 'disponible']

    def create(self, validated_data):
        # Obtener las coordenadas de 'ubicacion_geografica' desde el diccionario de datos iniciales
        ubicacion_geografica_data = validated_data.pop('ubicacion_geografica', None)
        if ubicacion_geografica_data and isinstance(ubicacion_geografica_data, dict):
            # Extraer las coordenadas y crear un objeto Point
            coordinates = ubicacion_geografica_data.get('coordinates', [])
            point = Point(coordinates[0], coordinates[1], srid=4326)
            validated_data['ubicacion_geografica'] = point

        # Crear el registro en la base de datos con los datos validados
        return Vehiculo.objects.create(**validated_data)