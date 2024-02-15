from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .serializer import SketchSerializer
from rest_framework.parsers import MultiPartParser
from .models import sketches
from IA_tools.uploadGAN import process_image

from PIL import Image, ImageOps
from rest_framework.decorators import action
from django.http import HttpResponse
import os
from django.http import FileResponse
from django.http import HttpResponseServerError

class SketchView(viewsets.ModelViewSet):
    serializer_class = SketchSerializer 
    queryset = sketches.objects.all()

    @action(detail=True, methods=['get'])
    def get_generated_image(self, request, pk=None):
        sketch = self.get_object()

        # Ruta de la imagen original
        original_image_path = sketch.input.path
        img_name = os.path.basename(sketch.input.path)
        output_gan_path = 'sketches/media/output/'+img_name

        # Aplicar la función de procesamiento de imagen GAN
        generated_image = process_image(original_image_path, output_gan_path, model='Simple')

        if generated_image:
            try:
                # Guardar el output_gan_path en el campo output del sketch
                sketch.output = 'sketches/media/output/'+img_name
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