from django.db import models
from django.utils import timezone

# Create your models here.
class images(models.Model):
    input = models.ImageField(upload_to='images/media/input/', default='')
    database = models.CharField(max_length=20, null=True, default='')
    results = models.JSONField(null=True, default=dict)
    description = models.CharField(max_length=200, default='')
    createdAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.description