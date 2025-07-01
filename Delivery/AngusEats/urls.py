from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
from .views import (ClienteViewSet, PedidoViewSet, VehiculoViewSet, ConfiguracionViewSet, 
                    AnalisisPedidoViewSet, UsuarioViewSet, UbicacionViewSet, LoginView)

# Configuración del router para los ViewSets
router = routers.DefaultRouter()

router.register(r'clientes', ClienteViewSet)
router.register(r'pedidos', PedidoViewSet, basename="pedidos")
router.register(r'vehiculos', VehiculoViewSet, basename="vehiculos")
router.register(r'usuarios', UsuarioViewSet, basename="usuario")
router.register(r'configuracion', ConfiguracionViewSet, basename='configuracion')
router.register(r'analisis-pedido', AnalisisPedidoViewSet, basename='analisispedido')
router.register(r'ubicaciones', UbicacionViewSet, basename='ubicaciones')

# Configuración de las URLs
urlpatterns = [
    # Endpoint para  JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    #endpoint nuevo para autenticacion con JWT
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LoginView.as_view(), name='logout'),    
    
    # Endpoints para la API
    path("api/", include(router.urls)),
    
    # Documentación de la API
    path('docs/', include_docs_urls(title="documentacion")),
]
