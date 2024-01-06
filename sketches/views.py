from django.shortcuts import render
from rest_framework import viewsets
from .serializer import SketchSerializer
from .models import sketches

# Create your views here.
class SketchView(viewsets.ModelViewSet):
    serializer_class = SketchSerializer
    queryset = sketches.objects.all()
