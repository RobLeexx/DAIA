from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import criminal, photosModel, identikitsModel
from .serializer import CriminalSerializer
from rest_framework import viewsets

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

