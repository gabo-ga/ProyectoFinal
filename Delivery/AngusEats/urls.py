from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet, ClienteViewSet, PedidoViewSet

# Configuración del router para los ViewSets
router = routers.DefaultRouter()

router.register(r'users', UserViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'pedidos', PedidoViewSet, basename="pedido")

urlpatterns = [
    # Endpoint para autenticación JWT
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Endpoints para la API v1
    path("api/v1/", include(router.urls)),
    
    # Documentación de la API
    path('docs/', include_docs_urls(title="prueba")),
]
