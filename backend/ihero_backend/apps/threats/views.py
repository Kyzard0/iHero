from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from .models import Threat
from .serializers import ThreatSerializer


class ThreatViewSet(viewsets.ModelViewSet):
    serializer_class = ThreatSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return Threat.objects.all()


class ActiveThreatsView(ListAPIView):
    serializer_class = ThreatSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return Threat.objects.filter(isActive=True)
