from django.db import models
from django.contrib.gis.db import models as gis_models

# Create your models here.
class Usuario(models.Model):
    ROL_CHOICES = [
        ('admin', 'Admin'),
        ('operador', 'Operador'),
        ('conductor', 'Conductor')
    ]
    
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    contrasena_hash = models = models.CharField(max_length=64)
    rol = models.CharField(max_length=50, choices=ROL_CHOICES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
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
        direccion_destino = models.CharField(max_length=255)
        estado = models.CharField(max_length=50, choices=ESTADO_CHOICES)
        fecha_creacion = models.DateTimeField(auto_now_add=True)
        fecha_entrega = models.DateTimeField(null=True, blank=True)
        ruta = models.ForeignKey('Ruta', null=True, blank=True, on_delete=models.SET_NULL)
        
        def __str__(self):
            return f"Pedido {self.id} - {self.cliente.nombre if self.cliente else 'Sin cliente'}"
     

class Vehiculo(models.Model):
    TIPO_CHOICES = [
        ('van','Van'),
        ('motocicleta', 'Motocicleta')
    ]
    
    vehiculo_nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)
    ubicacion_geografica = gis_models.PointField(srid=4326)
    conductor = models.ForeignKey('Usuario', null=True, blank=True ,on_delete=models.SET_NULL)
    disponible = models.BooleanField(default=True)
    
    def __str__(self):
        return self.vehiculo_nombre