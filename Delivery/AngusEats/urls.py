from django.urls import path, include
from rest_framework import routers
from AngusEats import views
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView,)
from .views import UserViewSet


router = routers.DefaultRouter()
router.register(r'AngusEats', views.TaskView, 'tasks')
router.register(r'users', UserViewSet)

urlpatterns = [
    #endpoint para obtener token
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #endpoint para refrescar tokens
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path("api/v1/", include(router.urls)),
    path('docs/', include_docs_urls(title="prueba"))
]
