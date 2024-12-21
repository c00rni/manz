import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from .models import Recipe, Item  # , RecipeItem
from rest_framework.authtoken.models import Token


class RegistrationView(TestCase):

    def setUp(self):
        self.register_url = reverse('manz:api-register')
        self.user_input_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password1': 'strongpassword123',
            'password2': 'strongpassword123',
        }

    def test_should_register_unknown_email(self):
        self.client.post(self.register_url, self.user_input_data)
        user = User.objects.filter(email=self.user_input_data['email']).first()
        self.assertIsNotNone(user)

    def test_should_not_register_multiple_users_with_the_same_username(self):
        User.objects.create_user(
            username="testuser",
            password="testpassword",
            email='test@example.com'
        )
        self.client.post(self.register_url, self.user_input_data)
        users = User.objects.filter(email=self.user_input_data['email']).all()
        self.assertEqual(len(users), 1)

    def test_should_not_register_user_with_unvalide_email(self):
        self.user_input_data = {
            'username': 'testuser',
            'email': 'not-a-email',
            'password1': 'strongpassword123',
            'password2': 'strongpassword123',
        }
        self.client.post(self.register_url, self.user_input_data)
        user = User.objects.filter(email=self.user_input_data['email']).first()
        self.assertIsNone(user)

    def test_should_not_register_user_without_email(self):
        self.user_input_data = {
            'username': 'testuser',
            'password1': 'strongpassword123',
            'password2': 'strongpassword123',
        }
        self.client.post(self.register_url, self.user_input_data)
        user = User.objects.filter(
            username=self.user_input_data['username']).first()
        self.assertIsNone(user)


class AuthentificationView(TestCase):

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

    def test_should_give_a_token_for_valid_credentials(self):
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertIn('token', response.data)

    def test_should_not_give_token_for_non_valid_credentials(self):
        self.user_input_data = {
            'password': 'testpassword',
            'email': 'non-existing-user@example.com'
        }
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertNotIn('token', response.data)

    def test_should_return_a_unauthoried_status_code_for_non_valid_credentials(self):
        self.user_input_data = {
            'password': 'testpassword',
            'email': 'non-existing-user@example.com'
        }
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_return_a_unauthoried_token_for_non_valid_credentials(self):
        self.user_input_data = {
            'password': 'testpassword',
        }
        response = self.client.post(self.login_url, self.user_input_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RecipeCreateView(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword")
        self.token = Token.objects.create(user=self.user)
        self.create_recipe_url = reverse('manz:api-recipe')

        self.recipe_title = "Chocolate Cake"
        self.first_item_name = "Flour"
        self.first_item_quantity_type = "cups"
        self.first_item_quantity = 2
        self.recipe_data = {
            "title": f"{self.recipe_title}",
            "description": "A delicious chocolate cake recipe.",
            "recipe_items": [
                {
                    "item": {
                        "name": f"{self.first_item_name}",
                        "image_url": "http://example.com/flour.jpg",
                        "quantity_type": f"{self.first_item_quantity_type}"
                    },
                    "quantity": self.first_item_quantity
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

    def test_should_create_recipe_for_an_authenticated_user(self):
        # Initialize Django's Client manually to send a token with the request
        client = Client()
        headers = {
            'HTTP_AUTHORIZATION': f'Token {self.token.key}',
        }

        client.post(
            self.create_recipe_url,
            data=json.dumps(self.recipe_data),
            content_type='application/json',
            **headers,
        )

        reciepe = Recipe.objects.filter(title=self.recipe_title).first()
        self.assertIsNotNone(reciepe)

    def test_should_not_authorized_recipe_creation_without_token(self):
        response = self.client.post(self.create_recipe_url, self.recipe_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_should_not_create_recipe_without_title(self):
        self.recipe_data = {
            "title": "",
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
            ]
        }
        response = self.client.post(self.create_recipe_url, self.recipe_data)
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_should_not_create_recipe_without_items(self):
        self.recipe_data = {
            "title": "Chocolate Cake",
            "description": "A delicious chocolate cake recipe.",
            "recipe_items": []
        }
        response = self.client.post(self.create_recipe_url, self.recipe_data)
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_should_create_all_recipe_items(self):
        # Initialize Django's Client manually to send a token with the request
        client = Client()
        headers = {
            'HTTP_AUTHORIZATION': f'Token {self.token.key}',
        }

        client.post(
            self.create_recipe_url,
            data=json.dumps(self.recipe_data),
            content_type='application/json',
            **headers,
        )

        items = Item.objects.filter().all()
        self.assertEqual(len(items), 2)

    # def test_should_find_the_quantity_of_a_item_associate_to_a_reciepe(self):
    #   self.assertIsNotNone(None)
