from rest_framework import serializers
from .models import VisitorAccess


class VisitorAccessSerializer(serializers.ModelSerializer):

    resident_name = serializers.ReadOnlyField(source="resident.username")

    class Meta:
        model = VisitorAccess
        fields = "__all__"
        read_only_fields = ("resident", "created_at")