from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import SketchSerializer
from rest_framework.parsers import MultiPartParser
from .models import sketches

# Create your views here.""" 
""" class SketchView(viewsets.ModelViewSet):
    serializer_class = SketchSerializer
    queryset = sketches.objects.all() """

class SketchView(viewsets.ModelViewSet):
    serializer_class = SketchSerializer 
    queryset = sketches.objects.all()
    """ parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('image')

        # You can save the image to the database or perform any other processing here
        # For example, saving the image to the database:
        uploaded_image = sketches.objects.create(image=uploaded_file)
        uploaded_image.save()

        # Puedes acceder a la URL de la imagen generada
        image_url = uploaded_image.image.url

        return Response({'image_url': image_url}) """