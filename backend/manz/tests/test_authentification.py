from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User


class AuthentificationView(TestCase):

    def setUp(self):
        self.login_url = reverse("manz:api-authentification")
        self.user = User.objects.create_user(
            username="testuser", password="testpassword", email="test@example.com"
        )
        self.user_input_data = {"password": "testpassword", "email": "test@example.com"}

    def test_should_give_a_token_for_valid_credentials(self):
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertIn("token", response.data)

    def test_should_not_give_token_for_non_valid_credentials(self):
        self.user_input_data = {
            "password": "testpassword",
            "email": "non-existing-user@example.com",
        }
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertNotIn("token", response.data)

    def test_should_return_a_unauthoried_status_code_for_non_valid_credentials(self):
        self.user_input_data = {
            "password": "testpassword",
            "email": "non-existing-user@example.com",
        }
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_return_a_unauthoried_token_for_non_valid_credentials(self):
        self.user_input_data = {
            "password": "testpassword",
        }
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
