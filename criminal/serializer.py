from rest_framework import serializers
from .models import photosModel, identikitsModel, criminal

class PhotosModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = photosModel
        fields = ['photo']

class IdentikitsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = identikitsModel
        fields = ['identikit']

class CriminalSerializer(serializers.ModelSerializer):
    photos = PhotosModelSerializer(many=True, required=False)
    identikits = IdentikitsModelSerializer(many=True, required=False)

    class Meta:
        model = criminal
        fields = '__all__'