from django.db import models
from django.conf import settings


class Recipe(models.Model):
    title = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True, null=True)  # Optional
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recipes"
    )  # Associate recipes with a user
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Item(models.Model):
    name = models.CharField(max_length=255, verbose_name="Item Name")
    image_url = models.URLField(
        blank=True, verbose_name="Image URL", null=True)
    quantity_type = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.name}"


class RecipeItem(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name="recipe_items"
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="recipe_items"
    )
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.item.name} - {self.quantity} {self.quantity_type or ''} for {self.recipe.title}"
