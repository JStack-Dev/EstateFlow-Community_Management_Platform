from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    vivienda = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "tipo_usuario",
            "activo",
            "is_active",
            "vivienda",
        ]