from django.urls import include, path
from rest_framework import routers
from .views import HeroViewSet, DeployHeroesView, UpdateBattlesView


router = routers.SimpleRouter()
router.register(r'heroes', HeroViewSet, basename='heroes')

urlpatterns = [
    path('', include(router.urls)),
    path('deploy_heroes/', DeployHeroesView.as_view(), name='deploy-heroes'),
    path('update_battles/', UpdateBattlesView.as_view(), name='update-battles')
]
