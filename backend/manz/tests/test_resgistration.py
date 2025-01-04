from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User


class RegistrationView(TestCase):

    def setUp(self):
        self.register_url = reverse("manz:api-register")
        self.user_input_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "strongpassword123",
            "password2": "strongpassword123",
        }

    def test_should_register_unknown_email(self):
        self.client.post(self.register_url, self.user_input_data)
        user = User.objects.filter(email=self.user_input_data["email"]).first()
        self.assertIsNotNone(user)

    def test_should_not_register_multiple_users_with_the_same_username(self):
        User.objects.create_user(
            username="testuser", password="testpassword", email="test@example.com"
        )
        self.client.post(self.register_url, self.user_input_data)
        users = User.objects.filter(email=self.user_input_data["email"]).all()
        self.assertEqual(len(users), 1)

    def test_should_not_register_user_with_unvalide_email(self):
        self.user_input_data = {
            "username": "testuser",
            "email": "not-a-email",
            "password1": "strongpassword123",
            "password2": "strongpassword123",
        }
        self.client.post(self.register_url, self.user_input_data)
        user = User.objects.filter(email=self.user_input_data["email"]).first()
        self.assertIsNone(user)

    def test_should_not_register_user_without_email(self):
        self.user_input_data = {
            "username": "testuser",
            "password1": "strongpassword123",
            "password2": "strongpassword123",
        }
        self.client.post(self.register_url, self.user_input_data)
        user = User.objects.filter(username=self.user_input_data["username"]).first()
        self.assertIsNone(user)
