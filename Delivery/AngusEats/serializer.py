from rest_framework import serializers
from .models import Usuario
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        
        


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('id', 'correo', 'contrasena_hash')