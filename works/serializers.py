from rest_framework import serializers
from .models import Work


class WorkSerializer(serializers.ModelSerializer):

    resident_name = serializers.ReadOnlyField(
        source="resident.username"
    )

    class Meta:
        model = Work
        fields = "__all__"
        read_only_fields = (
            "resident",
            "created_at",
        )