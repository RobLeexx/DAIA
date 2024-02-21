from django.db import models
from django.utils import timezone

# Create your models here.
class photosModel(models.Model):
    photo = models.ImageField(upload_to='criminal/media/photos/')

class identikitsModel(models.Model):
    identikit = models.ImageField(upload_to='criminal/media/identikits/')

class criminal(models.Model):
    lastname = models.CharField(max_length=30, default='')
    name = models.CharField(max_length=30, default='')
    alias = models.CharField(max_length=20, default='')
    case = models.CharField(max_length=20, null=True, default='')
    mainPhoto = models.ImageField(upload_to='criminal/media/photos/', default='')
    photos = models.ManyToManyField(photosModel)
    identikits = models.ManyToManyField(identikitsModel, null=True, blank=True)    
    description = models.CharField(max_length=200, default='')
    criminal_record = models.CharField(max_length=200, default='')
    createdAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.lastname