from rest_framework import serializers
from .models import sketches

class SketchSerializer(serializers.ModelSerializer):
    class Meta:
        model = sketches
        fields = '__all__'