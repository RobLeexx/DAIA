from django.shortcuts import render
from rest_framework import viewsets
from .serializer import ModelsSerializer
from .models import trainModel

# Create your views here.
class ModelView(viewsets.ModelViewSet):
    serializer_class = ModelsSerializer
    queryset = trainModel.objects.all() 