from django.test import TestCase, Client
from django.urls import reverse
from manz.models import Recipe, Item, RecipeItem, Meal
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from datetime import datetime, timedelta
from django.utils.timezone import make_aware


class ItemView(TestCase):

    def _create_item(self, name, quantity_type):
        return Item.objects.create(
            name=name,
            quantity_type=quantity_type
        )

    def _create_recipe_item(self, recipe, item, quantity):
        return RecipeItem.objects.create(
            recipe=recipe,
            item=item,
            quantity=quantity
        )

    def _create_recipe(self, title: str, description: str, user: User):
        return Recipe.objects.create(
            title="Scrambled Eggs",
            description="Beautiful scambled eggs",
            user=user
        )

    def _schedule_recipe(self, start_date, end_date, recipe: Recipe, user: User):
        return Meal.objects.create(
            user=user,
            recipe=recipe,
            start_date=make_aware(start_date),
            end_date=make_aware(end_date),
        )

    def setUp(self):
        self.john_user = User.objects.create_user(
            username="testuser",
            password="testpassword"
        )
        self.john_token = Token.objects.create(user=self.john_user)
        self.john_headers = {
            'HTTP_AUTHORIZATION': f'Token {self.john_token.key}',
        }

        self.item_url = reverse('manz:api-item')
        egg_item = self._create_item("egg", "units")
        butter_item = self._create_item("butter", "grams")
        salt_item = self._create_item("salt", "grams")

        self.john_scrambled_eggs_recipe = self._create_recipe(
            "Scrambled Eggs",
            "Beautiful scambled eggs",
            self.john_user
        )
        self._create_recipe_item(
            self.john_scrambled_eggs_recipe,
            butter_item,
            quantity=10
        )
        self._create_recipe_item(self.john_scrambled_eggs_recipe, egg_item, 2)
        self._create_recipe_item(self.john_scrambled_eggs_recipe, salt_item, 1)

    def test_should_list_items_needs_for_john_chocolate_cake(self):
        start_date = datetime.now()
        end_date = start_date + timedelta(hours=1)  # Meal lasts 1 hour
        self._schedule_recipe(
            start_date,
            end_date,
            self.john_scrambled_eggs_recipe,
            self.john_user
        )
        tomorrow = datetime.now() + timedelta(days=1)

        response = Client().get(
            self.item_url +
            f"?end_date={tomorrow.strftime("%Y-%m-%dT%H:%M:%SZ")}",
            content_type='application/json',
            **self.john_headers,
        )
        return_items = response.json()
        self.assertEqual(len(return_items), 3)
