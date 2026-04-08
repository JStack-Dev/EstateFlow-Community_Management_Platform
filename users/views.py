from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import json

User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):
    try:
        # 🔥 FORZAMOS lectura del body (fallback seguro)
        data = request.data

        # 👇 fallback si request.data viene vacío
        if not data:
            data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

    except Exception:
        return Response(
            {"error": "Error leyendo datos"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not username or not password:
        return Response(
            {"error": "Usuario y contraseña obligatorios"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "El usuario ya existe"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    user.is_active = True
    user.save()

    return Response(
        {"message": "Usuario creado correctamente"},
        status=status.HTTP_201_CREATED
    )