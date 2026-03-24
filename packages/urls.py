from django.urls import path
from .views import resident_packages_api, staff_packages_api, deliver_package_api

urlpatterns = [

    path("resident/", resident_packages_api),

    path("staff/", staff_packages_api),

    path("deliver/<int:pk>/", deliver_package_api),

]