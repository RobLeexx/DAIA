from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class photosModel(models.Model):
    photo = models.ImageField(upload_to='criminal/photos/')

class identikitsModel(models.Model):
    identikit = models.ImageField(upload_to='criminal/identikits/')

class criminal(models.Model):
    lastname = models.CharField(max_length=100, default='')
    name = models.CharField(max_length=100, default='')
    birthday = models.DateField(default=timezone.now)
    phone = models.IntegerField(max_length=15, default=0, null=True)
    address = models.CharField(max_length=100, default='')
    alias = models.CharField(max_length=50, default='ninguno', null=True, blank=True)
    #case = models.CharField(max_length=100, null=True, blank=True, default='')
    gender = models.CharField(max_length=10, default='Masculino')
    ci = models.CharField(max_length=20, default='')
    mainPhoto = models.ImageField(upload_to='criminal/photos/', default='')
    photos = models.ManyToManyField(photosModel, null=True, blank=True)
    identikits = models.ManyToManyField(identikitsModel, null=True, blank=True)    
    description = models.CharField(max_length=200, default='')
    criminalRecord = models.CharField(max_length=200, default='ninguna', null=True, blank=True)
    criminalOrganization = models.CharField(max_length=200, default='ninguna', null=True, blank=True)
    nationality = models.CharField(max_length=200, default='')
    dangerousness = models.FloatField(max_length=10, default='')
    relapse = models.IntegerField(max_length=10, default='')
    particularSigns = models.CharField(max_length=200, default='ninguna', null=True, blank=True)
    status = models.CharField(max_length=100, default='')
    specialty = ArrayField(models.CharField(max_length=50), blank=True, null=True)
    createdAt = models.DateTimeField(default=timezone.now)
    lastModified = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.lastname