import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


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


class RecipeCreateViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword")
        self.token = Token.objects.create(user=self.user)
        self.create_recipe_url = reverse('manz:api-recipe')

        self.recipe_data = {
            "title": "Chocolate Cake",
            "description": "A delicious chocolate cake recipe.",
            "recipe_items": [
                {
                    "item": {
                        "name": "Flour",
                        "image_url": "http://example.com/flour.jpg",
                        "quantity_type": "cups"
                    },
                    "quantity": 2
                },
                {
                    "item": {
                        "name": "Sugar",
                        "quantity_type": "cups"
                    },
                    "quantity": 1
                }
            ]
        }

    def test_should_create_recipe_for_an_authenticated(self):
        # Initialize Django's Client manually
        client = Client()

        # Set up the Authorization header manually with the token
        headers = {
            'HTTP_AUTHORIZATION': f'Token {self.token.key}',
        }

        # Perform a POST request with the headers and data
        response = client.post(
            self.create_recipe_url,
            # Explicitly serialize the data to JSON
            data=json.dumps(self.recipe_data),
            content_type='application/json',  # Set content type to JSON
            **headers,  # Pass headers for authentication
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


"""
class RecipeViewTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='test@example.com',
        )
        self.token = Token.objects.create(user=self.user)
        self.auth_headers = {
            'HTTP_AUTHORIZATION': f'Bearer {self.token.key}'
        }
        self.recipe_item_url = reverse('manz:api-recipe')
        self.valid_data = {
            "name": "Sugar",
            "quantity": 1.5,
            "quantity_type": "kg",
            "description": "Granulated sugar",
            "image_url": ""
        }

    def test_should_not_create_item_without_auth_token(self):

        response = self.client.post(
            self.recipe_item_url,
            self.valid_data,
            **self.auth_headers
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    # def test_should_not_
"""
