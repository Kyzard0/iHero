# Generated by Django 3.2.3 on 2021-05-31 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('threats', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='threat',
            name='isActive',
            field=models.BooleanField(default=False),
        ),
    ]
