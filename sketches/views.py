from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import SketchSerializer
from rest_framework.parsers import MultiPartParser
from .models import sketches
from IA_tools.uploadGAN import process_image
from IA_tools.uploadOF import search_face
from criminal.models import criminal
import json
from django.http import JsonResponse
from PIL import Image, ImageOps
from rest_framework.decorators import action
from django.http import HttpResponse
import os
from django.http import FileResponse
from django.http import HttpResponseServerError
import requests

class SketchView(viewsets.ModelViewSet):
    serializer_class = SketchSerializer 
    queryset = sketches.objects.all()

    @action(detail=True, methods=['get'])
    def get_generated_image(self, request, pk=None):
        sketch = self.get_object()

        # Obtener el parámetro 'name' enviado desde el cliente
        modelRequest = request.GET.get('model', '')

        # Ruta de la imagen original
        original_image_path = sketch.input.path
        img_name = os.path.basename(sketch.input.path)
        output_gan_path = 'media/sketches/output/'+img_name

        # Aplicar la función de procesamiento de imagen GAN
        generated_image = process_image(original_image_path, output_gan_path, model=modelRequest)

        if generated_image:
            try:
                # Guardar el output_gan_path en el campo output del sketch
                sketch.output = 'sketches/output/'+img_name
                sketch.save()
                # Devolver la imagen generada como respuesta usando FileResponse
                response = FileResponse(open(output_gan_path, 'rb'), content_type='image/jpeg')
                response['Content-Disposition'] = f'attachment; filename="{os.path.basename(output_gan_path)}"'
                return response
            except Exception as e:
                # Manejar cualquier error que pueda ocurrir al abrir el archivo
                return HttpResponseServerError(f"Error al abrir el archivo generado: {e}")
        else:
            return HttpResponse("Error al generar la imagen", status=500)

    def get_recognition_wheel3(self, request, pk=None):
            try:
                image = sketches.objects.get(pk=pk)
            except sketches.DoesNotExist:
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
            original_image_path = image.output.path  # Se asume que 'output' es el campo que contiene la ruta de la imagen de entrada
            json_results_path = 'media/sketches/results/' + str(image.pk) + '.json'  # Se utiliza el ID de la imagen como parte del nombre del archivo JSON

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

"""   @action(detail=True, methods=['get'])
        def get_black_and_white_image(self, request, pk=None):
        sketch = self.get_object()

        # Ruta de la imagen original
        original_image_path = sketch.image.path

        # Aplicar filtro de blanco y negro
        black_and_white_image = self.apply_black_and_white(original_image_path)

        # Crear una respuesta de la imagen procesada
        response = HttpResponse(content_type="image/jpeg")
        black_and_white_image.save(response, "JPEG")

        return response

    def apply_black_and_white(self, image_path):
        # Abrir la imagen original
        original_image = Image.open(image_path)

        # Convertir la imagen a escala de grises
        black_and_white_image = ImageOps.grayscale(original_image)

        return black_and_white_image """