import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from manz.models import Recipe, Item, Meal  # , RecipeItem
from rest_framework.authtoken.models import Token
from datetime import datetime, timedelta
from unittest import skip


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


class ScheduleMealView(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpassword",
            email="test@example.com"
        )
        self.token = Token.objects.create(user=self.user)

        self.recipe = Recipe.objects.create(
            title="Chocolate Cake",
            description="A delicious chocolate cake recipe.",
            user=self.user
        )

        self.create_meal_url = reverse('manz:api-meal')
        self.one_day_time = timedelta(days=1)

        self.now = datetime.utcnow()
        self.one_hour_later_from_now = self.now + timedelta(hours=1)
        self.recipe_data = {
            "recipe_id": self.recipe.id,
            "start_date": self.now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "end_date": self.one_hour_later_from_now.strftime(
                "%Y-%m-%dT%H:%M:%SZ"
            ),
        }

    def test_should_schedule_a_meal(self):
        # Initialize Django's Client manually to send a token with the request
        client = Client()
        headers = {
            'HTTP_AUTHORIZATION': f'Token {self.token.key}',
        }

        client.post(
            self.create_meal_url,
            data=json.dumps(self.recipe_data),
            content_type='application/json',
            **headers,
        )
        meal = Meal.objects.filter(user=self.user).first()
        self.assertIsNotNone(meal)

    def test_should_not_create_meals_for_unauthenticated_user(self):
        response = self.client.post(self.create_meal_url, self.recipe_data)
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    @skip("Not implemented")
    def test_should_only_get_meals_schedule_for_the_(self):
        client = Client()
        headers = {
            'HTTP_AUTHORIZATION': f'Token {self.token.key}',
        }

        # Create a meal in th next hour
        client.post(
            self.create_meal_url,
            data=json.dumps(self.recipe_data),
            content_type='application/json',
            **headers,
        )
        cake_recipe = Recipe.objects.create(
            title="Chocolate Cake",
            description="A delicious chocolate cake recipe.",
            user=self.user
        )

        soup_recipe = Recipe.objects.create(
            title="Onion soup",
            description="A delicious chocolate cake recipe.",
            user=self.user
        )

        today_meal = Meal.objects.create(
            user=self.user,
            recipe=cake_recipe,
            start_date=self.now,
            end_date=self.one_hour_later_from_now,
        ).first()

        tomorrow_meal = Meal.objects.create(
            user=self.user,
            recipe=soup_recipe,
            start_date=self.now + self.one_day_time,
            end_date=self.one_hour_later_from_now + self.one_day_time,
        ).first()

        client.get(
            self.create_meal_url,
            data=json.dumps(self.recipe_data),
            content_type='application/json',
            **headers,
        )

    @skip("Not implemented")
    def test_should_not_get_meals_not_own_by_the_authenticated_user(self):
        pass

    @skip("Not implemented")
    def test_should_not_schedule_a_meal_without_recipe(self):
        pass

    @skip("Not implemented")
    def test_should_not_schedule_a_meal_with_a_recipe_unauthorized_to_access(self):
        pass
