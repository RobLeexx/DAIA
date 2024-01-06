from django.db import models

# Create your models here.
class sketches(models.Model):
    name = models.CharField(max_length=100)
    canvas = models.BooleanField(default=True)

    def __str__(self):
        return self.name