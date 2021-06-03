from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from .enums import HERO_RANKS


class Hero(models.Model):
    name = models.CharField(max_length=50)
    rank = models.CharField(max_length=2,
                            choices=HERO_RANKS,
                            default='C')
    original_location = models.CharField(max_length=50)
    current_location = models.CharField(max_length=50)
    inBattle = models.BooleanField(default=False)

    def __str__(self):
        return self.name
