import json
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponseServerError
from django.http import JsonResponse
from rest_framework import viewsets
from .models import images
from .serializer import ImagesSerializer
from IA_tools.uploadOF import search_face

class ImageView(viewsets.ModelViewSet):
    serializer_class = ImagesSerializer
    queryset = images.objects.all()

    def get_recognition_wheel(self, request, pk=None):
        try:
            image = images.objects.get(pk=pk)
        except images.DoesNotExist:
            return HttpResponseServerError("Imagen no encontrada", status=404)

        # Ruta de la imagen original
        original_image_path = image.input.path

        filename = os.path.basename(original_image_path)
        number = os.path.splitext(filename)[0]

        # Carpeta de la base de datos para la comparación
        database_path = 'IA_tools/lanceros/'  # Reemplaza con la ruta correcta a tu base de datos

        # Ruta para almacenar el JSON de resultados
        json_results_path = 'images/media/output/'+number+'.json'
        
        # Llamar a la función search_face
        search_face(original_image_path, database_path, json_results_path)

        # Leer el JSON de resultados sin barras invertidas adicionales
        with open(json_results_path, 'r') as json_file:
            json_results = json.load(json_file)

        # Asignar el JSON de resultados al campo 'results' de la instancia
        image.results = json_results

        # Guardar la instancia del modelo
        image.save()

        # Devolver el JSON de resultados como respuesta
        return JsonResponse(json_results, safe=False)
