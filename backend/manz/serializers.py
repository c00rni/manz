from .models import Recipe, Item, RecipeItem, Meal
from rest_framework import serializers
from django.contrib.auth.models import User
from django.core.validators import validate_email


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=True, allow_blank=False)
    password1 = serializers.CharField(write_only=True, min_length=8, style={
                                      'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, min_length=8, style={
                                      'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def validate_email(self, email):
        if not email:
            raise serializers.ValidationError("This field is required.")
        try:
            validate_email(email)
        except serializers.ValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "This email is already taken.")

        return email

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
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
        recipe_items_data = validated_data.pop('recipe_items')
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


class MealSerializer(serializers.ModelSerializer):
    recipe_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Meal
        fields = [
            'id',
            'user',
            'start_date',
            'end_date',
            'recipe_id',
        ]

    def validate(self, data):
        user = self.context['request'].user
        recipe = Recipe.objects.filter(user=user, id=data['recipe_id']).first()
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError(
                "Start date must be earlier than end date.")

        if not recipe:
            raise serializers.ValidationError(
                "The selected recipe does not belong to the user.")

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        recipe = Recipe.objects.filter(id=validated_data['recipe_id']).first()
        meal = Meal.objects.create(
            user=user,
            recipe=recipe,
            start_date=validated_data['start_date'],
            end_date=validated_data['end_date']
        )
        return meal
