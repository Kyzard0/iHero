import random
from datetime import datetime

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from threats.models import Threat

from .models import Hero
from .enums import DANGER_LEVEL_TO_RANK
from .serializers import HeroSerializer
from .utils import calculate_distance, convert_location


class HeroViewSet(viewsets.ModelViewSet):
    serializer_class = HeroSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):

        queryset = Hero.objects.all()
        dangerLevel = self.request.query_params.get('dangerLevel')
        if dangerLevel is not None:
            queryset = queryset.filter(
                rank=DANGER_LEVEL_TO_RANK[dangerLevel], inBattle=False
            )
        return queryset


class DeployHeroesView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get_closest_hero_available(self, threat):
        heroes_available = Hero.objects.filter(
            inBattle=False, rank=DANGER_LEVEL_TO_RANK[threat.level])

        if heroes_available.exists():
            closest_hero = None
            shortest_distance = 999999999
            for hero in heroes_available:
                distance = calculate_distance(
                    convert_location(hero.current_location),
                    convert_location(threat.location)
                )
                if distance < shortest_distance:
                    shortest_distance = distance
                    closest_hero = hero

            return closest_hero
        return None

    def get_active_threats(self):
        return Threat.objects.filter(isActive=True, inBattle=False)

    def start_battle(self, hero, threat):
        hero.current_location = threat.location
        hero.inBattle = True
        hero.save()

        threat.battle_with = hero
        threat.inBattle = True
        timestamp_now = int(datetime.now().timestamp())
        threat.battle_start_timestamp = timestamp_now
        threat.battle_end_timestamp = (
            timestamp_now + self.get_predicted_battle_duration(threat))
        threat.save()

    def get_predicted_battle_duration(self, threat):
        if threat.level == 'GOD':
            return random.randint(300, 600)
        elif threat.level == 'DRAGON':
            return random.randint(120, 300)
        elif threat.level == 'TIGER':
            return random.randint(10, 20)
        else:
            return random.randint(1, 2)

    def get(self, request):
        for threat in self.get_active_threats():
            closest_hero = self.get_closest_hero_available(threat)
            if closest_hero is not None:
                self.start_battle(closest_hero, threat)

        return Response("Heroes deployed successfully")


class UpdateBattlesView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get_threats_in_battle(self):
        return Threat.objects.filter(inBattle=True)

    def get(self, request):
        battles = self.get_threats_in_battle()
        for battle in battles:
            timestamp_now = int(datetime.now().timestamp())
            if battle.battle_end_timestamp <= timestamp_now:
                hero = Hero.objects.get(id=battle.battle_with.id)
                hero.inBattle = False
                hero.save()
                battle.inBattle = False
                battle.isActive = False
                battle.save()
        return Response("Battles updated")
