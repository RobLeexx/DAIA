from django.db import models
from django.utils import timezone

# Create your models here.
class photosModel(models.Model):
    photo = models.ImageField(upload_to='criminal/photos/')

class identikitsModel(models.Model):
    identikit = models.ImageField(upload_to='criminal/identikits/')

class criminal(models.Model):
    lastname = models.CharField(max_length=100, default='')
    name = models.CharField(max_length=100, default='')
    birthday = models.DateField(default=timezone.now)
    alias = models.CharField(max_length=50, default='', null=True, blank=True)
    case = models.CharField(max_length=100, null=True, blank=True, default='')
    ci = models.CharField(max_length=20, default='')
    mainPhoto = models.ImageField(upload_to='criminal/photos/', default='')
    photos = models.ManyToManyField(photosModel, null=True, blank=True)
    identikits = models.ManyToManyField(identikitsModel, null=True, blank=True)    
    description = models.CharField(max_length=200, default='')
    criminal_record = models.CharField(max_length=200, default='', null=True, blank=True)
    createdAt = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.lastname