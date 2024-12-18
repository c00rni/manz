from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User


class RegistrationViewTest(TestCase):

    def setUp(self):
        self.register_url = reverse('manz:api-register')
        self.user_input_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'strongpassword123',
            'password2': 'strongpassword123',
        }

    def test_should_verify_unknown_email_can_register_as_user(self):
        response = self.client.post(self.register_url, self.user_input_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class AuthentificationViewTest(TestCase):

    def setUp(self):
        self.login_url = reverse('manz:api-authentification')
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='test@example.com'
        )
        self.user_input_data = {
            'password': 'testpassword',
            'email': 'test@example.com'
        }

    def test_should_verify_known_user_can_login(self):
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertIn('token', response.data)
