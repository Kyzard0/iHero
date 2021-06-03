from django.urls import include, path
from rest_framework import routers
from .views import ThreatViewSet, ActiveThreatsView


router = routers.SimpleRouter()
router.register(r'threats', ThreatViewSet, basename='threats')

urlpatterns = [
    path('', include(router.urls)),
    path('threats_active/', ActiveThreatsView.as_view(), name='active-theats')
]
