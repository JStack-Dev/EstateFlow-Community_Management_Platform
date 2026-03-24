from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [

    # ADMIN
    path("admin/", admin.site.urls),

    # AUTH
    path("api/auth/", include("users.urls")),

    # INCIDENTS
    path("api/incidents/", include("incidents.urls")),

   # RESERVATIONS
    path("api/reservations/", include("reservations.urls")),

    # PACKAGES
    path("api/packages/", include("packages.urls")),

    # ACCESS
    path("api/access/", include("access.urls")),

    # WORKS
    path("api/works/", include("works.urls")),

    path("api/notifications/", include("notifications.urls")),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )