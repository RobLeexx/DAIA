# Generated by Django 5.0.1 on 2024-02-22 07:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sketches', '0003_alter_sketches_input_alter_sketches_output'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sketches',
            name='input',
            field=models.ImageField(upload_to='sketches/input/'),
        ),
        migrations.AlterField(
            model_name='sketches',
            name='output',
            field=models.ImageField(default='', null=True, upload_to='sketches/output/'),
        ),
    ]