from django.urls import path
from .views import RoomView, CreateRoomView, main

urlpatterns = [
    path('home', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('hello', main),
]