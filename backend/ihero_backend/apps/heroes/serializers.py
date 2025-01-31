from rest_framework import serializers
from .models import Hero


class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = [
            'id', 'name', 'rank',
            'original_location', 'current_location', 'inBattle'
        ]
