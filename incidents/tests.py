from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class IncidentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="resident1",
            password="testpass123",
            role="USER",
        )

    def test_incident_creation(self):
        from incidents.models import Incident

        incident = Incident.objects.create(
            title="Luz rota",
            description="La luz del garaje no funciona",
            location="Garaje A",
            category="ELECTRICITY",
            urgency="NORMAL",
            status="OPEN",
            created_by=self.user,
        )

        self.assertEqual(incident.title, "Luz rota")
        self.assertEqual(incident.status, "OPEN")
        self.assertEqual(incident.created_by, self.user)

    def test_incident_status_transitions(self):
        from incidents.models import Incident

        allowed = Incident.ALLOWED_TRANSITIONS[Incident.Status.OPEN]
        self.assertIn(Incident.Status.IN_PROGRESS, allowed)
        self.assertNotIn(Incident.Status.RESOLVED, allowed)


class JWTAuthTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123",
            role="USER",
        )
        self.client = APIClient()

    def test_obtain_token(self):
        response = self.client.post(
            "/api/token/",
            {"username": "testuser", "password": "testpass123"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_access_protected_endpoint(self):
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)

        response = self.client.get(
            "/api/auth/me/",
            HTTP_AUTHORIZATION=f"Bearer {access_token}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "testuser")

    def test_access_without_token(self):
        response = self.client.get("/api/auth/me/")
        self.assertEqual(response.status_code, 401)
