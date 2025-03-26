from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.gis.geos import Point
from .models import Pedido, Vehiculo, Cliente, Configuracion, Ubicacion, EstadoPedido, AnalisisPedido, Usuario
#serializers

class LoginSerializer(serializers.Serializer):
    usuario = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    def validate(self, data):
        usuario = data.get('usuario')
        password = data.get('password')
        
        user = authenticate(username=usuario, password=password)
        if not user:
            raise serializers.ValidationError("usuario o contraseña incorrectos")
        
        if not user.is_active:
            raise serializers.ValidationError("cuenta inactiva")
        
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'Usuario': user.usuario,
            'rol': user.rol,
        }
        

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = Usuario
        fields = [
            'id', 
            'nombre', 
            'usuario', 
            'correo', 
            'rol', 
            'fecha_creacion', 
            'telefono',
            'password',
            'confirm_password',
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
    
    def validate(self, data):
        #valida que las contraseñas coincidan
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Las contraseñar no coinciden"})
        return data
    
    def create(self, validated_data):
        #crea un nuevo ususario
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        #actualiza un usuario
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password:
            instance.set_password(password)
        instance.save()
        return instance    

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
    destino = serializers.PrimaryKeyRelatedField(queryset=Ubicacion.objects.all(), write_only=True)
    destino_data = UbicacionSerializer(read_only=True, source='destino')
    estado = serializers.PrimaryKeyRelatedField(queryset=EstadoPedido.objects.all())


    class Meta:
        model = Pedido
        fields = [
            'id',
            'cliente',
            'conductor',
            'origen',
            'destino', #para put y post
            'destino_data', #para get
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
            'pedidos_cancelados',
            'tiempo_promedio_entrega_minutos',
            'kilometros_recorridos_totales',
            'fecha_analisis',
        ]
        read_only_fields = ['fecha_analisis']
        
    
#serializer para la configuracion
class ConfiguracionSerializer(serializers.ModelSerializer):

    latitud = serializers.FloatField(write_only=True, required=False)
    longitud = serializers.FloatField(write_only=True, required=False)
    direccion = serializers.CharField(source="direccion_origen", required=False)
    coordenadas = serializers.SerializerMethodField()

    class Meta:
        model = Configuracion
        fields = ['id', 'direccion', 'coordenadas', 'latitud', 'longitud']
        
    #metodo para extraer las coordenadas
    def get_coordenadas(self, obj):
        if obj.punto_origen:
            return obj.punto_origen.wkt
        return None

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