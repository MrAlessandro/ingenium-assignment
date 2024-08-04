from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.models import UsageSample
from core.serializers import UsageSampleSerializer
from django.core.cache import cache
from django.conf import settings


class SampleViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = UsageSample.objects.all()
    serializer_class = UsageSampleSerializer

    @action(methods=["get"], detail=False)
    def last(self, request, *args, **kwargs):
        last_sample = cache.get(settings.LAST_SAMPLE_CACHE_KEY)
        if not last_sample:
            last_sample = UsageSample.objects.order_by("created_at").last()
            if last_sample is None:
                return Response({"message": "No samples available"}, status=404)
            serializer = self.get_serializer(last_sample)
            last_sample = serializer.data
            cache.set(settings.LAST_SAMPLE_CACHE_KEY, last_sample)
        return Response(last_sample, status=200)
