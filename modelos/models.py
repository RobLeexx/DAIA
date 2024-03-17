from django.db import models
from django.utils import timezone

# Create your models here.

class trainModel(models.Model):
    type = models.CharField(max_length=20, default='')
    name = models.CharField(max_length=20, default='')
    data = models.JSONField(null=True, default=dict)
    description = models.CharField(max_length=200, default='')
    length = models.IntegerField(max_length=100, default='')
    createdAt = models.DateTimeField(default=timezone.now)