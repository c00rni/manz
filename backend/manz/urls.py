from django.urls import path
from .views import (
    UserRegistrationView,
    EmailAuthTokenView,
    RecipeCreateView,
    ScheduleMealView,
    MealView,
    ItemView,
)

app_name = "manz"
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='api-register'),
    path('login/', EmailAuthTokenView.as_view(), name='api-authentification'),
    path('recipe/', RecipeCreateView.as_view(), name='api-recipe'),
    path('schedule/', ScheduleMealView.as_view(), name='api-schedule'),
    path('meal/', MealView.as_view(), name='api-meal'),
    path('item/', ItemView.as_view(), name='api-item'),
]
