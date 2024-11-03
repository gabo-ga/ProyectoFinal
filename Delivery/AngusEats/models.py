from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.postgres.operations import CreateExtension
from django.core.validators import RegexValidator
# Create your models here.
class Usuario(models.Model):
    ROL_CHOICES = [
        ('admin', 'Admin'),
        ('operador', 'Operador'),
        ('conductor', 'Conductor')
    ]
    
    nombre = models.CharField(max_length=100)
    usuario = models.CharField(max_length=150, unique=True, null=True)
    correo = models.EmailField(unique=True)
    contrasena_hash = models.CharField(max_length=64)
    rol = models.CharField(max_length=50, choices=ROL_CHOICES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nombre
    
class Conductor(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=128)  # Almacena la contraseña en texto plano
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    telefono = models.CharField(max_length=15)

    def __str__(self):
        return self.nombre
    
class Cliente(models.Model):
        nombre = models.CharField(max_length=100)
        telefono = models.CharField(max_length=12)
        fecha_creacion = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return self.nombre
    
class Pedido(models.Model):
        ESTADO_CHOICES = [
            ('pendiente','Pendiente'),
            ('en_ruta','En Ruta'),
            ('entregado', 'Entregado'),
            ('cancelado', 'Cancelado')
        ]
        
        cliente = models.ForeignKey('Cliente', null=True, on_delete=models.SET_NULL)
        direccion_origen = models.CharField(max_length=255)
        coordenadas_origen = gis_models.PointField(srid=4326, null=True, blank=True)
        direccion_destino = models.CharField(max_length=255)
        coordenadas_destino = gis_models.PointField(srid=4326, null=True, blank=True)
        estado = models.CharField(max_length=50, choices=ESTADO_CHOICES)
        fecha_creacion = models.DateTimeField(auto_now_add=True)
        fecha_entrega = models.DateTimeField(null=True, blank=True)
        precio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
        detalle = models.CharField(max_length=500, null=True, blank=True)
        ruta = models.ForeignKey('Ruta', null=True, blank=True, on_delete=models.SET_NULL)
        
        def __str__(self):
            return f"Pedido {self.id} - {self.cliente.nombre if self.cliente else 'Sin cliente'}"
     
class Vehiculo(models.Model):
    TIPO_CHOICES = [
        ('van','Van'),
        ('motocicleta', 'Motocicleta')
    ]
        
    placa = models.CharField(
        max_length=7, 
        unique=True, 
        null=False,
        validators=[
            RegexValidator(
                regex='^[A-Za-z0-9]{7}$',
                message='La placa debe tener exactamente 7 caracteres alfanuméricos.'
            )
        ]
    )
    vehiculo_nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    ubicacion_geografica = gis_models.PointField(srid=4326)
    conductor = models.ForeignKey('Usuario', null=True, blank=True ,on_delete=models.SET_NULL)
    disponible = models.BooleanField(default=True)
    
    def __str__(self):
        return self.vehiculo_nombre

class Ruta(models.Model):
    ESTADO_CHOICES = [
        ('planificada', 'Planificada'),
        ('en_curso', 'En curso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada')
    ]

    vehiculo = models.ForeignKey('Vehiculo', on_delete=models.CASCADE)
    ruta_geom = gis_models.LineStringField(srid=4326, null=True, blank=True)
    paradas = gis_models.LineStringField(srid=4326)
    distancia_total_km = models.DecimalField(max_digits=10, decimal_places=2)
    tiempo_estimado_minutos = models.IntegerField()
    estado = models.CharField(max_length=50, choices=ESTADO_CHOICES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Ruta {self.id} - {self.vehiculo}"
    
class HistorialGPS(models.Model):
    vehiculo = models.ForeignKey('Vehiculo', on_delete=models.CASCADE)
    posicion = gis_models.PointField(srid=4326)
    marca_tiempo = models.DateTimeField(auto_now_add=False)
    
    def __str__(self):
        return f"Historial GPS {self.id} - Vehiculo {self.vehiculo}"

class AnalisisPedido(models.Model):
    pedidos_totales = models.IntegerField()
    pedidos_entregados = models.IntegerField()
    tiempo_promedio_entrega_minutos = models.IntegerField(null=True, blank=True)
    kilometros_recorridos_totales = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_analisis = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Analisis {self.id} = {self.fecha_analisis}"
    
#Model para la configuracion de direccino origen
# models.py
class Configuracion(models.Model):
    direccion_origen = models.CharField(max_length=255, blank=True, null=True) 
    punto_origen = gis_models.PointField(geography=True, blank=True, null=True) 

    def __str__(self):
        return f"Configuración (Dirección de origen: {self.direccion_origen})"
