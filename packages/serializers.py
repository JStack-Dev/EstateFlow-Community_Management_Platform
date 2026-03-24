from rest_framework import serializers
from .models import Package


class PackageSerializer(serializers.ModelSerializer):

    resident_name = serializers.ReadOnlyField(source="resident.username")

    class Meta:
        model = Package
        fields = "__all__"