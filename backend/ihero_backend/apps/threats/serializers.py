import hashlib
from datetime import datetime

from rest_framework import serializers

from heroes.serializers import HeroSerializer
from .models import Threat


class ThreatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Threat
        fields = [
            'id', 'name', 'level',
            'location', 'start_timestamp', 'inBattle',
            'isActive', 'battle_with', 'battle_start_timestamp',
            'battle_end_timestamp'
        ]

    def create(self, validated_data):
        name = validated_data['name']
        level = validated_data['level']
        location = validated_data['location']

        h = hashlib.md5()
        h.update((name + level + location).encode('utf-8'))
        unique_id = h.hexdigest()

        threat, created = Threat.objects.update_or_create(
            unique_id=unique_id, name=name, level=level, location=location,
            defaults={
                'isActive': True,
                'start_timestamp': int(datetime.now().timestamp())
            }
        )
        return threat

    def to_representation(self, instance):
        self.fields['battle_with'] = HeroSerializer(read_only=True)
        return super().to_representation(instance)
