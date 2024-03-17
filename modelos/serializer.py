from rest_framework import serializers
from .models import trainModel

class ModelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = trainModel
        fields = '__all__'