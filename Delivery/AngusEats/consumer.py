import json
from channels.generic.websocket import AsyncWebsocketConsumer

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conductor_id = self.scope['url_route']['kwargs']['conductor_id']
        self.room_group_name = f'location_{self.conductor_id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name, 
            self.channel_name
        )
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        
        await self.channel_layer.group_send(
            self.room_group_name,{
                'type': 'location_update',
                'latitude': latitude, 
                'longitude': longitude,
                'conductor_id': self.conductor_id
            }
        )
        
    async def location_update(self, event):
        await self.send(text_data=json.dumps({
            'latitude': event['latitude'],
            'longitude': event['longitude'],
            'conductor_id': event['conductor_id']
        }))