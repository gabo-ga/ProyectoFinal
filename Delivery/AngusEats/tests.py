from django.test import TestCase
from .models import Cliente

#test para los models
from django.test import TestCase
from django.contrib.gis.geos import Point
from .models import (
    Usuario, Cliente, Pedido, Ubicacion, EstadoPedido,
    Vehiculo, HistorialGPS, AnalisisPedido
)

class ModelsTestCase(TestCase):

    def setUp(self):
        # Set up data for testing
        self.usuario = Usuario.objects.create(
            nombre="Juan Pérez",
            usuario="juanperez",
            correo="juan@example.com",
            contrasena_hash="hashedpassword",
            rol="conductor",
            telefono="123456789"
        )

        self.cliente = Cliente.objects.create(
            nombre="Carlos López",
            telefono="70398777"
        )

        self.origen = Ubicacion.objects.create(
            direccion="Calle A",
            coordenadas=Point(1.0, 1.0)
        )

        self.destino = Ubicacion.objects.create(
            direccion="Calle B",
            coordenadas=Point(2.0, 2.0)
        )

        self.estado = EstadoPedido.objects.create(nombre="pendiente")

        self.vehiculo = Vehiculo.objects.create(
            placa="ABC1234",
            vehiculo_nombre="Motocicleta 1",
            tipo="motocicleta",
            ubicacion=self.origen,
            conductor=self.usuario,
            disponible=True
        )

        self.pedido = Pedido.objects.create(
            cliente=self.cliente,
            conductor=self.usuario,
            origen=self.origen,
            destino=self.destino,
            estado=self.estado,
            precio=150.00,
            detalle="Pedido urgente"
        )

        self.historial_gps = HistorialGPS.objects.create(
            vehiculo=self.vehiculo,
            posicion=Point(1.5, 1.5),
            marca_tiempo="2024-11-22T12:00:00Z"
        )

        self.analisis = AnalisisPedido.objects.create(
            pedidos_totales=100,
            pedidos_entregados=80,
            tiempo_promedio_entrega_minutos=30,
            kilometros_recorridos_totales=500.5
        )

    # Usuario Tests
    def test_usuario_creation(self):
        usuario = Usuario.objects.get(usuario="juanperez")
        self.assertEqual(usuario.nombre, "Juan Pérez")
        self.assertEqual(usuario.rol, "conductor")

    # Cliente Tests
    def test_cliente_creation(self):
        cliente = Cliente.objects.get(nombre="Carlos López")
        self.assertEqual(cliente.telefono, "70398777")

    # Ubicacion Tests
    def test_ubicacion_creation(self):
        ubicacion = Ubicacion.objects.get(direccion="Calle A")
        self.assertEqual(ubicacion.coordenadas.x, 1.0)
        self.assertEqual(ubicacion.coordenadas.y, 1.0)

    # EstadoPedido Tests
    def test_estado_pedido_creation(self):
        estado = EstadoPedido.objects.get(nombre="pendiente")
        self.assertEqual(estado.nombre, "pendiente")

    # Vehiculo Tests
    def test_vehiculo_creation(self):
        vehiculo = Vehiculo.objects.get(placa="ABC1234")
        self.assertEqual(vehiculo.vehiculo_nombre, "Motocicleta 1")
        self.assertTrue(vehiculo.disponible)
        self.assertEqual(vehiculo.conductor, self.usuario)

    # Pedido Tests
    def test_pedido_creation(self):
        pedido = Pedido.objects.get(detalle="Pedido urgente")
        self.assertEqual(pedido.precio, 150.00)
        self.assertEqual(pedido.origen, self.origen)
        self.assertEqual(pedido.destino, self.destino)

    # HistorialGPS Tests
    def test_historial_gps_creation(self):
        historial = HistorialGPS.objects.get(vehiculo=self.vehiculo)
        self.assertEqual(historial.posicion.x, 1.5)
        self.assertEqual(historial.posicion.y, 1.5)

    # AnalisisPedido Tests
    def test_analisis_pedido_creation(self):
        analisis = AnalisisPedido.objects.get(pedidos_totales=100)
        self.assertEqual(analisis.pedidos_entregados, 80)
        self.assertEqual(analisis.kilometros_recorridos_totales, 500.5)

#test para las relaciones:
class RelacionesIntegridadTestCase(TestCase):
    def setUp(self):
        # Crear objetos base para las pruebas
        self.usuario = Usuario.objects.create(
            nombre="Juan Pérez",
            usuario="juanperez",
            correo="juan@example.com",
            contrasena_hash="hashedpassword",
            rol="conductor",
            telefono="123456789"
        )

        self.cliente = Cliente.objects.create(
            nombre="Carlos López",
            telefono="987654321"
        )

        self.origen = Ubicacion.objects.create(
            direccion="Calle A",
            coordenadas=Point(1.0, 1.0)
        )

        self.destino = Ubicacion.objects.create(
            direccion="Calle B",
            coordenadas=Point(2.0, 2.0)
        )

        self.estado = EstadoPedido.objects.create(nombre="pendiente")

        self.vehiculo = Vehiculo.objects.create(
            placa="ABC1234",
            vehiculo_nombre="Motocicleta 1",
            tipo="motocicleta",
            ubicacion=self.origen,
            conductor=self.usuario,
            disponible=True
        )

        self.pedido = Pedido.objects.create(
            cliente=self.cliente,
            conductor=self.usuario,
            origen=self.origen,
            destino=self.destino,
            estado=self.estado,
            precio=150.00,
            detalle="Pedido urgente"
        )

        self.historial_gps = HistorialGPS.objects.create(
            vehiculo=self.vehiculo,
            posicion=Point(1.5, 1.5),
            marca_tiempo="2024-11-22T12:00:00Z"
        )

    # Pruebas de integridad

    # 1. Verificar que un pedido tiene cliente y conductor asignados correctamente
    def test_pedido_relaciones(self):
        pedido = Pedido.objects.get(id=self.pedido.id)
        self.assertEqual(pedido.cliente, self.cliente)
        self.assertEqual(pedido.conductor, self.usuario)

    # 2. Verificar que un pedido tiene ubicaciones de origen y destino asignadas
    def test_pedido_ubicaciones(self):
        pedido = Pedido.objects.get(id=self.pedido.id)
        self.assertEqual(pedido.origen, self.origen)
        self.assertEqual(pedido.destino, self.destino)

    # 3. Verificar que un vehículo tiene conductor asignado correctamente
    def test_vehiculo_conductor(self):
        vehiculo = Vehiculo.objects.get(id=self.vehiculo.id)
        self.assertEqual(vehiculo.conductor, self.usuario)

    # 4. Verificar que un historial GPS está asociado a un vehículo
    def test_historial_gps_vehiculo(self):
        historial = HistorialGPS.objects.get(id=self.historial_gps.id)
        self.assertEqual(historial.vehiculo, self.vehiculo)

    # Pruebas de eliminaciones

    # 5. Eliminar un cliente deja el campo cliente de los pedidos en NULL
    def test_eliminar_cliente(self):
        self.cliente.delete()
        pedido = Pedido.objects.get(id=self.pedido.id)
        self.assertIsNone(pedido.cliente)

    # 6. Eliminar un conductor deja el campo conductor de los pedidos en NULL
    def test_eliminar_conductor(self):
        self.usuario.delete()
        pedido = Pedido.objects.get(id=self.pedido.id)
        self.assertIsNone(pedido.conductor)

    # 7. Eliminar una ubicación deja los campos origen y destino de los pedidos en NULL
    def test_eliminar_ubicacion_origen(self):
        self.origen.delete()
        pedido = Pedido.objects.get(id=self.pedido.id)
        self.assertIsNone(pedido.origen)

    def test_eliminar_ubicacion_destino(self):
        self.destino.delete()
        pedido = Pedido.objects.get(id=self.pedido.id)
        self.assertIsNone(pedido.destino)

    # 8. Eliminar un estado no debería permitir la eliminación si hay pedidos asociados (PROTECT)
    def test_eliminar_estado_pedido_protegido(self):
        with self.assertRaises(Exception):  # Puede ser IntegrityError u otro tipo dependiendo de la base de datos
            self.estado.delete()

    # 9. Eliminar un vehículo elimina todos los historiales GPS asociados
    def test_eliminar_vehiculo_elimina_historial(self):
        self.vehiculo.delete()
        historiales = HistorialGPS.objects.filter(vehiculo=self.vehiculo)
        self.assertEqual(len(historiales), 0)

    # 10. Un conductor solo puede tener vehículos asignados
    def test_conductor_tiene_vehiculos(self):
        vehiculos = self.usuario.vehiculos.all()
        self.assertIn(self.vehiculo, vehiculos)
