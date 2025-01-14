import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from manz.models import Recipe, Item
from rest_framework.authtoken.models import Token
from unittest import skip


class RecipeCreateView(TestCase):

    def setUp(self):
        self.john_user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.john_token = Token.objects.create(user=self.john_user)
        self.create_recipe_url = reverse("manz:api-recipe")

        self.alice_user = User.objects.create_user(
            username="alice", password="testpassword"
        )
        self.alice_token = Token.objects.create(user=self.alice_user)
        self.alice_headers = {
            "HTTP_AUTHORIZATION": f"Token {self.alice_token.key}",
        }

        self.client = Client()
        self.john_headers = {
            "HTTP_AUTHORIZATION": f"Token {self.john_token.key}",
        }

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
                        "quantity_type": f"{self.first_item_quantity_type}",
                    },
                    "quantity": self.first_item_quantity,
                },
                {"item": {"name": "Sugar", "quantity_type": "cups"}, "quantity": 1},
            ],
        }
        self.selected_recipe_id = 1
        self.selected_recipe_url = reverse(
            "manz:api-selected-recipe", args=[self.selected_recipe_id]
        )

    def test_should_create_recipe_for_an_authenticated_user(self):
        # Initialize Django's Client manually to send a token with the request
        client = Client()
        headers = {
            "HTTP_AUTHORIZATION": f"Token {self.john_token.key}",
        }

        client.post(
            self.create_recipe_url,
            data=json.dumps(self.recipe_data),
            content_type="application/json",
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
                        "quantity_type": "cups",
                    },
                    "quantity": 2,
                },
            ],
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
            "recipe_items": [],
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
            "HTTP_AUTHORIZATION": f"Token {self.john_token.key}",
        }

        client.post(
            self.create_recipe_url,
            data=json.dumps(self.recipe_data),
            content_type="application/json",
            **headers,
        )

        items = Item.objects.filter().all()
        self.assertEqual(len(items), 2)

    @skip("Not implemented")
    def test_should_find_the_quantity_of_a_item_associate_to_a_reciepe(self):
        self.assertIsNotNone(None)

    def _create_chocolate_recipe_for_john(self):
        flour_item = Item.objects.create(
            name="Flour", image_url="http://example.com/flour.jpg", quantity_type="cups"
        )
        sugar_item = Item.objects.create(name="Sugar", quantity_type="cups")

        # Create a recipe
        recipe = Recipe.objects.create(
            user=self.john_user,
            title="Chocolate Cake",
            description="A delicious chocolate cake recipe.",
        )
        recipe.recipe_items.create(item=flour_item, quantity=2)
        recipe.recipe_items.create(item=sugar_item, quantity=1)

    def test_should_delelte_john_recipe(self):
        self._create_chocolate_recipe_for_john()

        john_recipe = Recipe.objects.filter(user=self.john_user).first()
        self.selected_recipe_id = john_recipe.id
        response = self.client.delete(self.selected_recipe_url, **self.john_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_should_not_allow_to_delete_others_recipe(self):
        self._create_chocolate_recipe_for_john()
        john_recipe = Recipe.objects.filter(user=self.john_user).first()
        self.selected_recipe_id = john_recipe.id
        response = self.client.delete(self.selected_recipe_url, **self.alice_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
