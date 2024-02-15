from django.db import models
from django.utils import timezone

# Create your models here.
class sketches(models.Model):
    canvas = models.BooleanField(default=True)
    input = models.ImageField(upload_to='sketches/media/input/')
    output = models.ImageField(upload_to='sketches/media/output/', null=True, default='')
    description = models.CharField(max_length=200, default='')
    createdAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.description