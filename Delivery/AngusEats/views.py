from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework import viewsets
from .serializer import TaskSerializer
from django.contrib.auth.models import User
from .serializer import UserSerializer
from .models import Usuario
# Create your views here.

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {'message': 'Esta es una vista protegida'}
        return Response(data)


class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Usuario.objects.all()
    
    
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all() 
    serializer_class = UserSerializer