from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
import json

User = get_user_model()


# ---------------------------------------
# REGISTER
# ---------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):
    try:
        data = request.data or json.loads(request.body or "{}")
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

    # 🔥 asegurar que esté activo para JWT
    user.is_active = True
    user.save()

    return Response(
        {"message": "Usuario creado correctamente"},
        status=status.HTTP_201_CREATED
    )


# ---------------------------------------
# LOGIN (CUSTOM JWT)
# ---------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    try:
        data = request.data or json.loads(request.body or "{}")
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

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Credenciales incorrectas"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {"error": "Usuario inactivo"},
            status=status.HTTP_403_FORBIDDEN
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })


# ---------------------------------------
# CURRENT USER (🔥 CLAVE PARA FRONTEND)
# ---------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_api(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


# ---------------------------------------
# USER MANAGEMENT (ADMIN)
# ---------------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_list_api(request):

    if request.user.role != "ADMIN":
        return Response(
            {"error": "No autorizado"},
            status=status.HTTP_403_FORBIDDEN
        )

    users = User.objects.all().order_by("id")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def user_update_api(request, pk):

    if request.user.role != "ADMIN":
        return Response(
            {"error": "No autorizado"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    data = request.data
    if "role" in data and data["role"] not in ["ADMIN", "STAFF", "USER"]:
        return Response(
            {"error": "Rol no válido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = UserSerializer(user, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)