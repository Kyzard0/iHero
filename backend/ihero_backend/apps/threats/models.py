from datetime import datetime

from django.db import models

from heroes.models import Hero
from .enums import THREATS_RANKS


class Threat(models.Model):
    unique_id = models.CharField(max_length=32, unique=True,
                                 null=True, blank=True)
    name = models.CharField(max_length=50)
    level = models.CharField(max_length=10,
                             choices=THREATS_RANKS,
                             default='WOLF')
    location = models.CharField(max_length=50)
    isActive = models.BooleanField(default=True)
    inBattle = models.BooleanField(default=False)
    start_timestamp = models.IntegerField(
        blank=True, null=True, default=int(datetime.now().timestamp())
    )
    battle_start_timestamp = models.IntegerField(blank=True, null=True)
    battle_end_timestamp = models.IntegerField(blank=True, null=True)
    battle_with = models.ForeignKey(
        Hero, related_name='threats', on_delete=models.SET_NULL, blank=True, null=True
    )

    def __str__(self):
        return self.name
