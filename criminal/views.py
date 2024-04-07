from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import criminal, photosModel, identikitsModel
from .serializer import CriminalSerializer
from rest_framework import viewsets
from django.http import HttpResponseServerError
from django.http import JsonResponse
from IA_tools.uploadOF import search_face
import json
import os
import requests

class CriminalView(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = CriminalSerializer
    queryset = criminal.objects.all()

    def create(self, request, *args, **kwargs):
        # Copia mutable de request.data para evitar modificar el objeto original
        mutable_data = request.data.copy()

        # Manejar el campo de fotos (photos) para asegurarse de que sea una lista
        photos_data = mutable_data.getlist('photos')
        mutable_data.setlist('photos', photos_data)

        identikits_data = mutable_data.getlist('identikits')
        mutable_data.setlist('identikits', identikits_data)

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)

        # Guardar el criminal principal
        self.perform_create(serializer)

        # Guardar las fotos en la tabla photosModel
        for photo_data in photos_data:
            photos_model_instance = photosModel(photo=photo_data)
            photos_model_instance.save()

            # Asociar la foto al criminal creado
            serializer.instance.photos.add(photos_model_instance)

        for identikit_data in identikits_data:
            identikits_model_instance = identikitsModel(identikit=identikit_data)
            identikits_model_instance.save()

            # Asociar la foto al criminal creado
            serializer.instance.identikits.add(identikits_model_instance)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_recognition_wheel2(self, request, pk=None):
        try:
            image = criminal.objects.get(pk=pk)
        except criminal.DoesNotExist:
            return HttpResponseServerError("Imagen no encontrada", status=404)

        # Obtener el parámetro 'name' enviado desde el cliente
        name = request.GET.get('name', '')

        # Realizar el GET a la URL especificada
        url = 'http://127.0.0.1:8000/modelos/api/v1/modelos/'
        response = requests.get(url)
        
        # Verificar si la solicitud fue exitosa
        if response.status_code == 200:
            models_data = response.json()
            
            # Buscar el modelo con el nombre correspondiente
            matching_model = next((model for model in models_data if model['name'] == name), None)
            
            if matching_model:
                if matching_model['type'] == 'criminales':
                    # Obtener las rutas de las imágenes de la carpeta 'media/criminal/photos/'
                    img_filenames = [os.path.join('media/criminal/photos', os.path.basename(data['img'])) for data in matching_model['data']]
                elif matching_model['type'] == 'identikits':
                    # Obtener las rutas de las imágenes de la carpeta 'media/sketches/output'
                    img_filenames = [os.path.join('media/sketches/output', os.path.basename(data['img'])) for data in matching_model['data']]
                else:
                    return HttpResponseServerError("Tipo de modelo no reconocido: {}".format(matching_model['type']), status=400)
            else:
                return HttpResponseServerError("No se encontraron modelos coincidentes", status=404)

        else:
            print("Error al obtener los modelos:", response.status_code)
            return HttpResponseServerError("Error al obtener los modelos", status=500)

        # Ruta para almacenar el JSON de resultados
        original_image_path = image.mainPhoto.path  # Se asume que 'mainPhoto' es el campo que contiene la ruta de la imagen de entrada
        json_results_path = 'media/criminal/results/' + str(image.pk) + '.json'  # Se utiliza el ID de la imagen como parte del nombre del archivo JSON

        # Llamar a la función search_face
        search_face(original_image_path, img_filenames, json_results_path)

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