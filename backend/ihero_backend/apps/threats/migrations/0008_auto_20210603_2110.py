# Generated by Django 3.2.3 on 2021-06-03 21:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('threats', '0007_auto_20210602_2338'),
    ]

    operations = [
        migrations.AddField(
            model_name='threat',
            name='unique_id',
            field=models.CharField(blank=True, max_length=32, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='threat',
            name='start_timestamp',
            field=models.IntegerField(blank=True, default=1622754600, null=True),
        ),
    ]
