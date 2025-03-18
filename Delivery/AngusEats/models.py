from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.postgres.operations import CreateExtension
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UsuarioManager(BaseUserManager):
    def create_user(self, usuario, nombre, telefono, password=None, **extra_fields):
        if not usuario:
            raise ValueError("El campo 'usuario' es obligatorio.")
        if not telefono:
            raise ValueError("El campo 'telefono' es obligatorio.")
        
        extra_fields.setdefault('is_active', True)
        user = self.model(usuario=usuario, nombre=nombre, telefono=telefono, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, usuario, nombre, telefono, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('rol', 'admin')
        return self.create_user(usuario, nombre, telefono, password, **extra_fields)



# Create your models here.
class Usuario(AbstractBaseUser, PermissionsMixin):
    ROL_CHOICES = [
        ('admin', 'Admin'),
        ('conductor', 'Conductor')
    ]
    
    nombre = models.CharField(max_length=100)
    usuario = models.CharField(max_length=150, unique=True, null=True)
    correo = models.EmailField(unique=True)
    rol = models.CharField(max_length=50, choices=ROL_CHOICES)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    telefono = models.CharField(max_length=15, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'usuario'
    REQUIRED_FIELDS = ['nombre', 'correo', 'telefono']
    
    objects = UsuarioManager()
    
    def __str__(self):
        return f"{self.nombre} ({self.rol})"  

class Cliente(models.Model):
        nombre = models.CharField(max_length=100)
        telefono = models.CharField(max_length=12)
        fecha_creacion = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return self.nombre
    
class Pedido(models.Model):
        cliente = models.ForeignKey('Cliente', null=True, on_delete=models.SET_NULL)
        conductor = models.ForeignKey('Usuario',null=True,blank=True,on_delete=models.SET_NULL,limit_choices_to={'rol': 'conductor'},related_name='pedidos') 
        origen = models.ForeignKey('Ubicacion', related_name='origen_pedidos', null=True, on_delete=models.SET_NULL)
        destino = models.ForeignKey('Ubicacion', related_name='destino_pedidos', null=True, on_delete=models.SET_NULL)
        estado = models.ForeignKey('EstadoPedido', on_delete=models.PROTECT)
        fecha_creacion = models.DateTimeField(auto_now_add=True)
        fecha_entrega = models.DateTimeField(null=True, blank=True)
        precio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
        detalle = models.CharField(max_length=500, null=True, blank=True)
        
        def __str__(self):
            return f"Pedido {self.id} - {self.cliente.nombre if self.cliente else 'Sin cliente'}"

class Ubicacion(models.Model):
    direccion = models.CharField(max_length=255)
    coordenadas = gis_models.PointField(srid=4326, null=True, blank=True)

    def __str__(self):
        return self.direccion

class EstadoPedido(models.Model):
    ESTADO_CHOICES = [
            ('pendiente','Pendiente'),
            ('entregado', 'Entregado'),
            ('cancelado', 'Cancelado')
        ]
    nombre =  models.CharField(max_length=50, unique=True, choices=ESTADO_CHOICES)    

    def __str__(self):
        return self.nombre


class Vehiculo(models.Model):
    TIPO_CHOICES = [
        ('van', 'Van'),
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
    ubicacion = models.ForeignKey(
        'Ubicacion',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='vehiculos'
    ) 
    conductor = models.ForeignKey(
        'Usuario',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        limit_choices_to={'rol': 'conductor'},
        related_name='vehiculos'
    ) 
    disponible = models.BooleanField(default=True)
    
    def __str__(self):
        return self.vehiculo_nombre

    
class HistorialGPS(models.Model):
        vehiculo = models.ForeignKey('Vehiculo', on_delete=models.CASCADE)
        posicion = gis_models.PointField(srid=4326)
        marca_tiempo = models.DateTimeField(auto_now_add=False)
    
        def __str__(self):
                return f"Historial GPS {self.id} - Vehiculo {self.vehiculo}"


class AnalisisPedido(models.Model):
    pedidos_totales = models.IntegerField()
    pedidos_entregados = models.IntegerField()
    pedidos_cancelados = models.IntegerField(default=0)
    tiempo_promedio_entrega_minutos = models.IntegerField(null=True, blank=True)
    kilometros_recorridos_totales = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_analisis = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Analisis {self.id} = {self.fecha_analisis}"
    
#Model para la configuracion de direccino origen
# models.py
class Configuracion(models.Model):
    direccion_origen = models.CharField(max_length=255, blank=True, null=True) 
    punto_origen = gis_models.PointField(srid=4326, null=True, blank=True)


    def __str__(self):
        return f"Configuración (Dirección de origen: {self.direccion_origen})"
