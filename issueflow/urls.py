from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # 🔥 JWT (ESTO ES LO QUE FALTA EN TU SERVIDOR)
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("api/auth/", include("users.urls")),
    path("api/incidents/", include("incidents.urls")),
    path("api/reservations/", include("reservations.urls")),
    path("api/packages/", include("packages.urls")),
    path("api/access/", include("access.urls")),
    path("api/works/", include("works.urls")),
    path("api/notifications/", include("notifications.urls")),
]