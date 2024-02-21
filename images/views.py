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
from criminal.models import criminal
from urllib.parse import urlparse
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
        database_path = 'criminal/media/photos/'  # Reemplaza con la ruta correcta a tu base de datos

        # Ruta para almacenar el JSON de resultados
        json_results_path = 'images/media/output/'+number+'.json'
        
        # Llamar a la función search_face
        search_face(original_image_path, database_path, json_results_path)

        # Leer el JSON de resultados sin barras invertidas adicionales
        with open(json_results_path, 'r') as json_file:
            json_results = json.load(json_file)

        # Vincular el parámetro 'img' con 'mainPhoto' en la tabla 'criminal'
        linked_results = []
        added_criminal_ids = set()

        for result in json_results:
            img_filename = os.path.basename(result['img'])
            img_filename_without_ext = os.path.splitext(img_filename)[0]

            # Buscar el criminal por el nombre de archivo de la imagen en 'mainPhoto'
            criminal_matches = criminal.objects.filter(mainPhoto__icontains=img_filename_without_ext)

            if criminal_matches.exists():
                # Seleccionar el primer criminal que coincide (puedes ajustar esto según tus reglas)
                criminal_match = criminal_matches.first()
                criminal_id = criminal_match.id

                # Verificar si ya se ha agregado este 'criminal_id' con el mismo 'per'
                while criminal_id in added_criminal_ids:
                    # Agregar un sufijo al 'criminal_id' si ya existe con el mismo 'per'
                    criminal_id += 1

                linked_results.append({"criminal_id": criminal_id, "per": result['per']})
                added_criminal_ids.add(criminal_id)

        # Ordenar los resultados por 'per' de mayor a menor
        linked_results = sorted(linked_results, key=lambda x: float(x['per'].replace('%', '')), reverse=True)

        # Devolver el JSON de resultados vinculados como respuesta
        return JsonResponse(linked_results, safe=False)
