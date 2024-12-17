from django.test import TestCase
from django.urls import reverse
from rest_framework import status


class RegistrationViewTest(TestCase):

    def setUp(self):
        self.register_url = reverse('manz:api-register')
        self.valid_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'strongpassword123',
            'password2': 'strongpassword123',
        }

    def test_should_verify_unknown_email_can_register_as_user(self):
        response = self.client.post(self.register_url, self.valid_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
