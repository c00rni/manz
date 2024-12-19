from .models import Recipe, Item, RecipeItem
from rest_framework import serializers
from django.contrib.auth.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, min_length=8, style={
                                      'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, min_length=8, style={
                                      'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def validate(self, data):
        # Check if passwords match
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )
        return user


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'image_url', 'quantity_type']


class RecipeItemSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = RecipeItem
        fields = ['item', 'quantity']


class RecipeSerializer(serializers.ModelSerializer):
    recipe_items = RecipeItemSerializer(many=True)

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'recipe_items']

    def create(self, validated_data):
        # Extract recipe items data
        recipe_items_data = validated_data.pop('recipe_items')
        # Attach the user from context
        user = self.context['request'].user
        recipe = Recipe.objects.create(user=user, **validated_data)

        for recipe_item_data in recipe_items_data:
            item_data = recipe_item_data.pop('item')
            item, created = Item.objects.get_or_create(
                name=item_data['name'],
                defaults={
                    'image_url': item_data.get('image_url'),
                    'quantity_type': item_data.get('quantity_type')
                }
            )
            RecipeItem.objects.create(
                recipe=recipe, item=item, quantity=recipe_item_data['quantity']
            )

        return recipe
