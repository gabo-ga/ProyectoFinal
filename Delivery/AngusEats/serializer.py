from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Pedido, Vehiculo, Cliente, Conductor
from django.contrib.gis.geos import Point



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
         
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'telefono']
    
from django.contrib.gis.geos import Point
from rest_framework import serializers
from .models import Pedido, Cliente

class PedidoSerializer(serializers.ModelSerializer):
    coordenadas_origen = serializers.DictField(write_only=True, required=False)
    coordenadas_destino = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = Pedido
        fields = [
            'id',
            'cliente',
            'direccion_origen',
            'coordenadas_origen',
            'direccion_destino',
            'coordenadas_destino',
            'estado',
            'fecha_creacion',
            'fecha_entrega',
            'precio',
            'detalle',
            'ruta',
        ]
        read_only_fields = ['fecha_creacion']

    def create(self, validated_data):
        coordenadas_origen_data = validated_data.pop('coordenadas_origen', None)
        coordenadas_destino_data = validated_data.pop('coordenadas_destino', None)


        date = self.initial_data.get('date')
        time = self.initial_data.get('time')
        if date and time:
            fecha_entrega = f"{date}T{time}:00Z"
            validated_data['fecha_entrega'] = fecha_entrega

        
        pedido = Pedido.objects.create(**validated_data)

        
        if coordenadas_origen_data:
            lat = float(coordenadas_origen_data.get('lat'))
            lng = float(coordenadas_origen_data.get('lng'))
            pedido.coordenadas_origen = Point(lng, lat)
            pedido.save()

        
        if coordenadas_destino_data:
            lat = float(coordenadas_destino_data.get('lat'))
            lng = float(coordenadas_destino_data.get('lng'))
            pedido.coordenadas_destino = Point(lng, lat)
            pedido.save()

        return pedido

        
class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = ['id', 'vehiculo_nombre', 'tipo', 'ubicacion_geografica', 'conductor', 'disponible', 'placa']

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
    
class VehiculoUbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = ['ubicacion_geografica']
    def get_ubicacion_geografica(self, obj):
        # Convertir el campo Point en un formato serializable (latitud y longitud)
        if isinstance(obj.ubicacion_geografica, Point):
            return {
                "latitude": obj.ubicacion_geografica.y,
                "longitude": obj.ubicacion_geografica.x
            }
        return None
    
class ConductorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conductor
        fields = ['id', 'nombre', 'correo', 'contraseña', 'fecha_creacion', 'telefono']