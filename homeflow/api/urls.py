from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, main

urlpatterns = [
    path('rooms', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('hello', main),
    path('get-room', GetRoom.as_view()),
]