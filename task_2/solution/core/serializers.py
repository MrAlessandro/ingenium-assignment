from rest_framework import serializers
from core.models import UsageSample


class UsageSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageSample
        fields = "__all__"
