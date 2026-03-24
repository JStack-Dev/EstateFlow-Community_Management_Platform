from django.urls import path
from .views import resident_access_api, staff_access_api

urlpatterns = [

    path("resident/", resident_access_api),

    path("staff/", staff_access_api),

]