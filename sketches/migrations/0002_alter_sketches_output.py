# Generated by Django 5.0.1 on 2024-02-07 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sketches', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sketches',
            name='output',
            field=models.ImageField(default='', null=True, upload_to='sketches/output/'),
        ),
    ]
