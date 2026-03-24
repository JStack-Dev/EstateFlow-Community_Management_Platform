from django.urls import path
from .views import reservations_api, facilities_list_api

urlpatterns = [
    path("", reservations_api),
    path("facilities/", facilities_list_api),
]