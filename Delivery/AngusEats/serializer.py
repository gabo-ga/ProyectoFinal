from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from .models import Pedido, Vehiculo, Cliente, Configuracion, Ubicacion, EstadoPedido, AnalisisPedido, Usuario
#serializers

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 
            'nombre', 
            'usuario', 
            'correo', 
            'contrasena_hash', 
            'rol', 
            'fecha_creacion', 
            'telefono'
        ]
        read_only_fields = ['fecha_creacion']

    def validate_rol(self, value):
        if value not in dict(Usuario.ROL_CHOICES):
            raise serializers.ValidationError("El rol no es válido. Debe ser 'admin' o 'conductor'.")
        return value

    def validate_correo(self, value):
        if Usuario.objects.filter(correo=value).exists():
            raise serializers.ValidationError("Este correo ya está en uso.")
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
         
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'telefono']
 
class UbicacionSerializer(serializers.ModelSerializer):
    coordenadas = serializers.SerializerMethodField()  # Para lectura
    coordenadas_input = serializers.JSONField(write_only=True, required=False)  # Para escritura

    class Meta:
        model = Ubicacion
        fields = ['id', 'direccion', 'coordenadas', 'coordenadas_input']

    # Método para extraer las coordenadas
    def get_coordenadas(self, obj):
        if obj.coordenadas:
            return f"POINT ({obj.coordenadas.x:.6f} {obj.coordenadas.y:.6f})"
        return None

    # Sobrescribir `create` para manejar `coordenadas_input`
    def create(self, validated_data):
        coordenadas_input = validated_data.pop('coordenadas_input', None)
        if coordenadas_input:
            validated_data['coordenadas'] = Point(coordenadas_input['lng'], coordenadas_input['lat'], srid=4326)
        return super().create(validated_data)

    # Sobrescribir `update` para manejar `coordenadas_input`
    def update(self, instance, validated_data):
        coordenadas_input = validated_data.pop('coordenadas_input', None)
        if coordenadas_input:
            instance.coordenadas = Point(coordenadas_input['lng'], coordenadas_input['lat'], srid=4326)
        return super().update(instance, validated_data)

class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedido
        fields = ['id', 'nombre']
    
class PedidoSerializer(serializers.ModelSerializer):
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())
    conductor = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(rol='conductor'),
        allow_null=True,
        required=False
    )
    origen = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all())
    destino = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all())
    estado = serializers.PrimaryKeyRelatedField(queryset=EstadoPedido.objects.all())


    class Meta:
        model = Pedido
        fields = [
            'id',
            'cliente',
            'conductor',
            'origen',
            'destino',
            'estado',
            'fecha_creacion',
            'fecha_entrega',
            'precio',
            'detalle',
        ]

    def create(self, validated_data):
        return Pedido.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
     
class VehiculoSerializer(serializers.ModelSerializer):
    ubicacion = serializers.PrimaryKeyRelatedField(
        queryset=Ubicacion.objects.all(),
        allow_null=True,
        required=False
    )
    conductor = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.filter(rol='conductor'),
        allow_null=True,
        required=False
    )
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Vehiculo
        fields = [
            'id',
            'placa',
            'vehiculo_nombre',
            'tipo',
            'tipo_display',
            'ubicacion',
            'conductor',
            'disponible',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Añadir datos anidados para 'ubicacion' y 'conductor'
        representation['ubicacion'] = UbicacionSerializer(instance.ubicacion).data if instance.ubicacion else None
        representation['conductor'] = UsuarioSerializer(instance.conductor).data if instance.conductor else None
        return representation

class AnalisisPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalisisPedido
        fields = [
            'id',
            'pedidos_totales',
            'pedidos_entregados',
            'tiempo_promedio_entrega_minutos',
            'kilometros_recorridos_totales',
            'fecha_analisis',
        ]
        read_only_fields = ['fecha_analisis']
        
    
#serializer para la configuracion
class ConfiguracionSerializer(serializers.ModelSerializer):

    latitud = serializers.FloatField(write_only=True, required=False)
    longitud = serializers.FloatField(write_only=True, required=False)

    class Meta:
        model = Configuracion
        fields = ['id', 'direccion_origen', 'punto_origen', 'latitud', 'longitud']

    def create(self, validated_data):
        latitud = validated_data.pop('latitud', None)
        longitud = validated_data.pop('longitud', None)
        if latitud is not None and longitud is not None:
            validated_data['punto_origen'] = Point(longitud, latitud, srid=4326)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        latitud = validated_data.pop('latitud', None)
        longitud = validated_data.pop('longitud', None)
        if latitud is not None and longitud is not None:
            instance.punto_origen = Point(longitud, latitud, srid=4326)
        instance.direccion_origen = validated_data.get('direccion_origen', instance.direccion_origen)
        instance.save()
        return instance