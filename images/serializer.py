from rest_framework import serializers
from .models import images

class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = images
        fields = '__all__'