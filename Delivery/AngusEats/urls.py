from django.urls import path, include
from rest_framework import routers
from AngusEats import views
from rest_framework.documentation import include_docs_urls


router = routers.DefaultRouter()
router.register(r'AngusEats', views.TaskView, 'tasks')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path('docs/', include_docs_urls(title="prueba"))
]
