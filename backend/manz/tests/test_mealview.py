from django.test import TestCase, Client
from manz.models import Meal, Recipe
from django.utils.timezone import make_aware
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from datetime import datetime, timedelta
from django.urls import reverse


class ListScheduleMeal(TestCase):

    def _create_user_john(self):
        self.john_user = User.objects.create_user(
            username="john1",
            password="testpassword",
            email="john@example.com"
        )
        self.john_token = Token.objects.create(user=self.john_user)
        self.john_authentificaiton_headers = {
            'HTTP_AUTHORIZATION': f'Token {self.john_token.key}',
        }

    def _create_user_alice(self):
        self.alice_user = User.objects.create_user(
            username="alice1",
            password="testpassword",
            email="alice@example.com"
        )
        self.alice_token = Token.objects.create(user=self.alice_user)
        self.alice_authentificaiton_headers = {
            'HTTP_AUTHORIZATION': f'Token {self.alice_token.key}',
        }

    def _create_john_recipes(self):
        self.john_chocolate_recipe = Recipe.objects.create(
            title="Chocolate Cake",
            description="A delicious chocolate cake recipe.",
            user=self.john_user
        )

        self.john_onion_soup_recipe = Recipe.objects.create(
            title="Onion soup",
            description="A delicious onion soup recipe.",
            user=self.john_user
        )

    def _create_alice_recipes(self):
        self.alice_pancake_recipe = Recipe.objects.create(
            title="Pancake",
            description="A delicious pancake recipe.",
            user=self.alice_user
        )

        self.alice_muffin_recipe = Recipe.objects.create(
            title="Muffin",
            description="A delicious Muffin recipe.",
            user=self.alice_user
        )

    def _schedule_john_meal(self):
        Meal.objects.create(
            user=self.john_user,
            recipe=self.john_chocolate_recipe,
            start_date=make_aware(self.now),
            end_date=make_aware(self.now + self.one_hour),
        )

        Meal.objects.create(
            user=self.john_user,
            recipe=self.john_onion_soup_recipe,
            start_date=make_aware(self.now + self.one_day_time),
            end_date=make_aware(self.now + self.one_day_time + self.one_hour),
        )

    def _schedule_alice_meal(self):
        Meal.objects.create(
            user=self.alice_user,
            recipe=self.alice_pancake_recipe,
            start_date=make_aware(self.now),
            end_date=make_aware(self.now + self.one_hour),
        )

        Meal.objects.create(
            user=self.alice_user,
            recipe=self.alice_muffin_recipe,
            start_date=make_aware(self.now + self.one_day_time),
            end_date=make_aware(self.now + self.one_day_time + self.one_hour),
        )

    def setUp(self):
        self.now = datetime.utcnow()
        self.one_day_time = timedelta(days=1)
        self.one_hour = timedelta(hours=1)
        self.start_date = make_aware(datetime.utcnow() - timedelta(hours=1))
        self.str_start_date = self.start_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        self.end_date = self.start_date + timedelta(hours=3)
        self.str_end_date = self.end_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        self.meal_url = reverse('manz:api-meal')

    def test_should_list_meal_started_in_the_time_frame(self):
        client = Client()
        self._create_user_john()
        self._create_john_recipes()
        self._schedule_john_meal()
        url_parameters = f"?start_date={
            self.str_start_date}&end_date={self.str_end_date}"

        response = client.get(
            self.meal_url + url_parameters,
            content_type='application/json',
            **self.john_authentificaiton_headers,
        )

        meals_in_time_frame = response.json()
        self.assertEqual(len(meals_in_time_frame), 1)

    def test_should_only_list_meal_they_own(self):
        client = Client()
        self._create_user_john()
        self._create_john_recipes()
        self._schedule_john_meal()
        self._create_user_alice()
        self._create_alice_recipes()
        self._schedule_alice_meal()
        url_parameters = f"?start_date={
            self.str_start_date}&end_date={self.str_end_date}"

        response = client.get(
            self.meal_url + url_parameters,
            content_type='application/json',
            **self.john_authentificaiton_headers,
        )

        meals_in_time_frame = response.json()
        self.assertEqual(len(meals_in_time_frame), 1)
