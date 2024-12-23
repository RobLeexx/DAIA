# Generated by Django 5.0.1 on 2024-02-29 12:36

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='identikitsModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identikit', models.ImageField(upload_to='criminal/identikits/')),
            ],
        ),
        migrations.CreateModel(
            name='photosModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(upload_to='criminal/photos/')),
            ],
        ),
        migrations.CreateModel(
            name='criminal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lastname', models.CharField(default='', max_length=100)),
                ('name', models.CharField(default='', max_length=100)),
                ('birthday', models.DateField(default=django.utils.timezone.now)),
                ('phone', models.IntegerField(default=0, max_length=15, null=True)),
                ('address', models.CharField(default='', max_length=100)),
                ('alias', models.CharField(blank=True, default='ninguno', max_length=50, null=True)),
                ('gender', models.CharField(default='Masculino', max_length=10)),
                ('ci', models.CharField(default='', max_length=20)),
                ('mainPhoto', models.ImageField(default='', upload_to='criminal/photos/')),
                ('description', models.CharField(default='', max_length=200)),
                ('criminalRecord', models.CharField(blank=True, default='ninguna', max_length=200, null=True)),
                ('criminalOrganization', models.CharField(blank=True, default='ninguna', max_length=200, null=True)),
                ('nationality', models.CharField(default='', max_length=200)),
                ('dangerousness', models.FloatField(default='', max_length=10)),
                ('relapse', models.IntegerField(default='', max_length=10)),
                ('particularSigns', models.CharField(blank=True, default='ninguna', max_length=200, null=True)),
                ('status', models.CharField(default='', max_length=100)),
                ('createdAt', models.DateTimeField(default=django.utils.timezone.now)),
                ('lastModified', models.DateTimeField(default=django.utils.timezone.now)),
                ('identikits', models.ManyToManyField(blank=True, null=True, to='criminal.identikitsmodel')),
                ('photos', models.ManyToManyField(blank=True, null=True, to='criminal.photosmodel')),
            ],
        ),
    ]
