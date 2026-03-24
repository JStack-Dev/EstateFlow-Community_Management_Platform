from rest_framework import serializers
from .models import Reservation, Facility


class FacilitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Facility
        fields = "__all__"


class ReservationSerializer(serializers.ModelSerializer):

    facility_name = serializers.ReadOnlyField(source="facility.name")

    class Meta:
        model = Reservation
        fields = "__all__"
        read_only_fields = ("user", "created_at")

    def create(self, validated_data):

        request = self.context.get("request")

        if request and request.user.is_authenticated:
            validated_data["user"] = request.user

        return super().create(validated_data)