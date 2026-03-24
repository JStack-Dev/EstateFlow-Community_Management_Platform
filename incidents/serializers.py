from rest_framework import serializers
from .models import Incident


class IncidentSerializer(serializers.ModelSerializer):

    resolution_time = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Incident
        fields = "__all__"
        read_only_fields = (
            "created_at",
            "resolved_at",
            "created_by",
            "resolution_time",
        )

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["created_by"] = request.user
        return super().create(validated_data)
