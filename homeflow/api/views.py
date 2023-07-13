from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room

def main(request):
    return HttpResponse("hello!!") 

# Create your views here.
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer