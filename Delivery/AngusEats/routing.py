from django.urls import re_path
from .consumer import LocationConsumer

websocket_urlpatterns = [
    re_path(r'ws/location/(?P<conductor_id>\d+)/$', LocationConsumer.as_asgi()),
]