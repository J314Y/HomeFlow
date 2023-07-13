from django.urls import path
from .views import RoomView, main

urlpatterns = [
    path('home', RoomView.as_view()),
    path('hello', main),
]