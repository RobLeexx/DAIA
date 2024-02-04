from django.db import models

# Create your models here.
class sketches(models.Model):
    canvas = models.BooleanField(default=True)
    image = models.ImageField(upload_to='sketches/uploads/')
    description = models.CharField(max_length=200, default='')

    def __str__(self):
        return self.description