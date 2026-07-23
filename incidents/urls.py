from django.urls import path
from .views import incident_list_api, incident_update_api, incident_stats_api

urlpatterns = [
    path("", incident_list_api),
    path("stats/", incident_stats_api),
    path("<int:pk>/", incident_update_api),
]