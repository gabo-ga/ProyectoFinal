# tests/test_models.py

from django.test import TestCase
from .models import Cliente

class ClienteModelTest(TestCase):

    def setUp(self):
        # Se ejecuta antes de cada prueba
        Cliente.objects.create(nombre="Jose Carlos Fernandez")

    def test_cliente_nombre(self):
        # Verificar que el nombre del cliente es correcto
        cliente = Cliente.objects.get(nombre="Jose Carlos Fernandez")
        self.assertEqual(cliente.nombre, "Jose Carlos Fernandez")

