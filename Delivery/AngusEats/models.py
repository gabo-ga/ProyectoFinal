from django.db import models

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
        telefono = models.CharField(12)
    
    class Pedido(models.Model):
        ESTADO_CHOICES = [
            ('pendiente','Pendiente'),
            ('en_ruta','En Ruta'),
            ('entregado', 'Entregado'),
            ('cancelado', 'Cancelado')
        ]
        
        cliente