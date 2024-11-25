#test para los models
from django.test import TestCase
from django.urls import reverse
from django.contrib.gis.geos import Point
from .models import (
    Usuario, Cliente, Pedido, Ubicacion, EstadoPedido,
    Vehiculo, HistorialGPS, AnalisisPedido
)
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .serializer import UserSerializer, ClienteSerializer, UsuarioSerializer, PedidoSerializer, EstadoPedidoSerializer, UbicacionSerializer


class ModelsTestCase(TestCase):

    def setUp(self):
        # Set up data for testing
        self.usuario = Usuario.objects.create(
            nombre="Juan Pérez",
            usuario="juanperez",
            correo="juan@example.com",
            contrasena_hash="hashedpassword",
            rol="conductor",
            telefono="70392999"
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
            telefono="70392999"
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

#test para user serializer
class UserSerializerTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="johndoe",
            email="john@example.com",
            first_name="John",
            last_name="Doe",
            is_active=True
        )

    def test_user_serialization(self):
        serializer = UserSerializer(self.user)
        expected_data = {
            "id": self.user.id,
            "username": "johndoe",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "is_active": True
        }
        self.assertEqual(serializer.data, expected_data)
        
class ClienteSerializerTestCase(APITestCase):
    def setUp(self):
        self.cliente = Cliente.objects.create(nombre="Carlos López", telefono="70392999")

    def test_cliente_serialization(self):
        serializer = ClienteSerializer(self.cliente)
        expected_data = {
            "id": self.cliente.id,
            "nombre": "Carlos López",
            "telefono": "70392999"
        }
        self.assertEqual(serializer.data, expected_data)

    def test_cliente_deserialization(self):
        data = {"nombre": "Ana García", "telefono": "70594333"}
        serializer = ClienteSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        cliente = serializer.save()
        self.assertEqual(cliente.nombre, "Ana García")
        self.assertEqual(cliente.telefono, "70594333")
        
class UsuarioSerializerAPITestCase(APITestCase):
    def setUp(self):
        # Crear datos iniciales
        self.usuario = Usuario.objects.create(
            nombre="Juan Pérez",
            usuario="juanperez",
            correo="juan@example.com",
            contrasena_hash="hashed_password",
            rol="conductor",
            telefono="123456789"
        )

    def test_serializacion(self):
        """Verificar que los datos del modelo Usuario se serialicen correctamente."""
        serializer = UsuarioSerializer(self.usuario)
        expected_data = {
            "id": self.usuario.id,
            "nombre": "Juan Pérez",
            "usuario": "juanperez",
            "correo": "juan@example.com",
            "contrasena_hash": "hashed_password",
            "rol": "conductor",
            "fecha_creacion": self.usuario.fecha_creacion.isoformat(),
            "telefono": "123456789"
        }
        self.assertEqual(
            serializer.data["fecha_creacion"][:19],
            expected_data["fecha_creacion"][:19]
        )

    def test_deserializacion_valida(self):
        """Verificar que los datos válidos se deserialicen y creen un usuario."""
        data = {
            "nombre": "María López",
            "usuario": "marialopez",
            "correo": "maria@example.com",
            "contrasena_hash": "hashed_password",
            "rol": "admin",
            "telefono": "987654321"
        }
        serializer = UsuarioSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        usuario = serializer.save()
        self.assertEqual(usuario.nombre, "María López")
        self.assertEqual(usuario.rol, "admin")

    def test_validacion_rol_invalido(self):
        """Verificar que se detecte un rol inválido."""
        data = {
            "nombre": "Pedro Gómez",
            "usuario": "pedrogomez",
            "correo": "pedro@example.com",
            "contrasena_hash": "hashed_password",
            "rol": "invalido",  # Rol no válido
            "telefono": "123456789"
        }
        serializer = UsuarioSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("rol", serializer.errors)

    def test_validacion_correo_duplicado(self):
        """Verificar que no se permita un correo duplicado."""
        data = {
            "nombre": "Carlos López",
            "usuario": "carloslopez",
            "correo": "juan@example.com",  # Correo duplicado
            "contrasena_hash": "hashed_password",
            "rol": "conductor",
            "telefono": "987654321"
        }
        serializer = UsuarioSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("correo", serializer.errors)
        
class PedidoAPITestCase(APITestCase):

    def setUp(self):
        self.cliente = Cliente.objects.create(nombre='Cliente Test')
        self.conductor = Usuario.objects.create(nombre='Conductor Test', rol='conductor')
        self.origen = Ubicacion.objects.create(direccion='Origen Test', coordenadas='POINT(-58.3816 -34.6037)')
        self.destino = Ubicacion.objects.create(direccion='Destino Test', coordenadas='POINT(-58.3816 -34.6037)')
        self.estado = EstadoPedido.objects.create(nombre='pendiente')

        # URL para la lista de pedidos
        self.pedido_list_url = reverse('pedido-list')

        # Datos iniciales
        self.pedido_data = {
            'cliente': self.cliente.id,
            'conductor': self.conductor.id,
            'origen': self.origen.id,
            'destino': self.destino.id,
            'estado': self.estado.id,
            'fecha_entrega': '2023-10-10T10:00:00Z',
            'precio': '100.00',
            'detalle': 'Entrega urgente'
        }

    def test_create_pedido(self):
        #POST
        response = self.client.post(self.pedido_list_url, self.pedido_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        pedido = Pedido.objects.get(id=response.data['id'])
        self.assertEqual(pedido.cliente, self.cliente)
        self.assertEqual(pedido.conductor, self.conductor)
        self.assertEqual(pedido.origen, self.origen)
        self.assertEqual(pedido.destino, self.destino)
        self.assertEqual(pedido.estado, self.estado)
        self.assertEqual(str(pedido.precio), '100.00')
        self.assertEqual(pedido.detalle, 'Entrega urgente')

    def test_retrieve_pedido(self):
        # Crear un pedido para recuperar
        pedido = Pedido.objects.create(
            cliente=self.cliente,
            conductor=self.conductor,
            origen=self.origen,
            destino=self.destino,
            estado=self.estado,
            precio='150.00',
            detalle='Pedido para recuperar'
        )
        url = reverse('pedido-detail', args=[pedido.id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = PedidoSerializer(pedido).data
        self.assertEqual(response.data, expected_data)

    def test_update_pedido(self):
        # Crear un pedido para actualizar
        pedido = Pedido.objects.create(
            cliente=self.cliente,
            conductor=None,
            origen=self.origen,
            destino=self.destino,
            estado=self.estado,
            precio='50.00',
            detalle='Pedido original'
        )
        url = reverse('pedido-detail', args=[pedido.id])
        update_data = {
            'conductor': self.conductor.id,
            'precio': '200.00',
            'detalle': 'Pedido actualizado'
        }
        response = self.client.patch(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        pedido.refresh_from_db()
        self.assertEqual(pedido.conductor, self.conductor)
        self.assertEqual(str(pedido.precio), '200.00')
        self.assertEqual(pedido.detalle, 'Pedido actualizado')

    def test_delete_pedido(self):
        # Crear un pedido para eliminar
        pedido = Pedido.objects.create(
            cliente=self.cliente,
            conductor=self.conductor,
            origen=self.origen,
            destino=self.destino,
            estado=self.estado,
            precio='120.00',
            detalle='Pedido para eliminar'
        )
        url = reverse('pedido-detail', args=[pedido.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Pedido.objects.filter(id=pedido.id).exists())

    def test_list_pedidos(self):
        # Crear varios pedidos
        Pedido.objects.create(
            cliente=self.cliente,
            conductor=self.conductor,
            origen=self.origen,
            destino=self.destino,
            estado=self.estado,
            precio='100.00',
            detalle='Pedido 1'
        )
        Pedido.objects.create(
            cliente=self.cliente,
            conductor=None,
            origen=self.origen,
            destino=self.destino,
            estado=self.estado,
            precio='150.00',
            detalle='Pedido 2'
        )
        response = self.client.get(self.pedido_list_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_invalid_pedido_creation(self):
        # Probar la creación de un pedido con datos inválidos
        invalid_data = self.pedido_data.copy()
        invalid_data['precio'] = 'precio_invalido'
        response = self.client.post(self.pedido_list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('precio', response.data)

    def test_missing_required_field(self):
        # Probar creación con campo obligatorio faltante
        invalid_data = self.pedido_data.copy()
        invalid_data.pop('cliente')
        response = self.client.post(self.pedido_list_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cliente', response.data)

class VehiculoAPITestCase(APITestCase):

    def setUp(self):
        self.ubicacion = Ubicacion.objects.create(direccion='Calle Falsa 123')
        self.conductor = Usuario.objects.create(nombre='Juan Pérez', rol='conductor')
        self.vehiculo_data = {
            'placa': 'ABC1234',
            'vehiculo_nombre': 'Camioneta 1',
            'tipo': 'van',
            'ubicacion': self.ubicacion.id,
            'conductor': self.conductor.id,
            'disponible': True
        }
        self.vehiculo_list_url = reverse('vehiculos-list')

    def test_create_vehiculo(self):
        response = self.client.post(self.vehiculo_list_url, self.vehiculo_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vehiculo.objects.count(), 1)
        vehiculo = Vehiculo.objects.get()
        self.assertEqual(vehiculo.placa, 'ABC1234')
        self.assertEqual(vehiculo.vehiculo_nombre, 'Camioneta 1')

class AnalisisPedidoAPITestCase(APITestCase):

    def setUp(self):
        self.analisis_list_url = reverse('analisispedido-list')
        self.analisis_data = {
            "pedidos_totales": 100,
            "pedidos_entregados": 95,
            "tiempo_promedio_entrega_minutos": 30,
            "kilometros_recorridos_totales": "1500.50"
        }

    def test_create_analisis_pedido(self):
        response = self.client.post(self.analisis_list_url, self.analisis_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AnalisisPedido.objects.count(), 1)
        analisis = AnalisisPedido.objects.get()
        self.assertEqual(analisis.pedidos_totales, 100)
        self.assertEqual(analisis.pedidos_entregados, 95)

