from rest_framework.routers import DefaultRouter
from django.urls import include, path
from core.viewsets import SampleViewSet


router = DefaultRouter()
router.register(r"samples", SampleViewSet)

urlpatterns = [path("api/", include(router.urls))]
