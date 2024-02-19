from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import ImagesSerializer
from rest_framework.parsers import MultiPartParser
from .models import images

class ImageView(viewsets.ModelViewSet):
    serializer_class = ImagesSerializer
    queryset = images.objects.all()