from django.contrib import admin
from AngusEats.models import Usuario, Cliente, Pedido, Vehiculo, Ruta, HistorialGPS, AnalisisPedido

# Register your models here.

admin.site.register(Usuario)
admin.site.register(Cliente)
admin.site.register(Pedido)
admin.site.register(Vehiculo)
admin.site.register(Ruta)
admin.site.register(HistorialGPS)
admin.site.register(AnalisisPedido)
