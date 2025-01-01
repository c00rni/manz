import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from manz.models import Recipe, Meal  # , RecipeItem
from rest_framework.authtoken.models import Token
from django.utils.timezone import make_aware
from datetime import datetime, timedelta


class ScheduleMealView(TestCase):

    def setUp(self):
        self.john_user = User.objects.create_user(
            username="john1",
            password="testpassword",
            email="john@example.com"
        )
        self.john_token = Token.objects.create(user=self.john_user)

        self.john_chocolate_recipe = Recipe.objects.create(
            title="Chocolate Cake",
            description="A delicious chocolate cake recipe.",
            user=self.john_user
        )

        self.john_onion_soup_recipe = Recipe.objects.create(
            title="Onion soup",
            description="A delicious chocolate cake recipe.",
            user=self.john_user
        )

        self.now = make_aware(datetime.utcnow())
        self.one_hour_later_from_now = make_aware(
            datetime.utcnow() + timedelta(hours=1)
        )
        self.john_chocolate_schedule_detail = {
            "recipe_id": self.john_chocolate_recipe.id,
            "start_date": self.now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "end_date": self.one_hour_later_from_now.strftime(
                "%Y-%m-%dT%H:%M:%SZ"
            ),
        }
        self.schedule_url = reverse('manz:api-schedule')

    def test_should_schedule_a_meal(self):
        # Initialize Django's Client manually to send a token with the request
        client = Client()
        headers = {
            'HTTP_AUTHORIZATION': f'Token {self.john_token.key}',
        }

        client.post(
            self.schedule_url,
            data=json.dumps(self.john_chocolate_schedule_detail),
            content_type='application/json',
            **headers,
        )
        meal = Meal.objects.filter(user=self.john_user).first()
        self.assertIsNotNone(meal)

    def test_should_not_create_meals_for_unauthenticated_user(self):
        response = self.client.post(
            self.schedule_url, self.john_chocolate_schedule_detail)
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_should_not_schedule_a_meal_with_a_recipe_unauthorized_to_access(self):
        client = Client()
        self.alice_user = User.objects.create_user(
            username="alice1",
            password="testpassword",
            email="alice@example.com"
        )
        self.alice_token = Token.objects.create(user=self.alice_user)
        headers = {
            'HTTP_AUTHORIZATION': f'Token {self.alice_token.key}',
        }

        client.post(
            self.schedule_url,
            data=json.dumps(self.john_chocolate_schedule_detail),
            content_type='application/json',
            **headers,
        )
        meal = Meal.objects.filter(user=self.john_user).first()
        self.assertIsNone(meal)
