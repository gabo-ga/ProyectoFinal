from rest_framework import serializers
from .models import Usuario

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'correo', 'contrasena_hash')