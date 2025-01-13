from django.urls import path
from .views import (
    UserRegistrationView,
    EmailAuthTokenView,
    RecipeCreateView,
    RecipeView,
    ScheduleMealView,
    ItemView,
)

app_name = "manz"
urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="api-register"),
    path("login/", EmailAuthTokenView.as_view(), name="api-authentification"),
    path("recipe/", RecipeCreateView.as_view(), name="api-recipe"),
    path(
        "recipe/<int:recipe_id>/",
        RecipeView.as_view(),
        name="api-selected-recipe"
    ),
    path("schedule/", ScheduleMealView.as_view(), name="api-schedule"),
    path("item/", ItemView.as_view(), name="api-item"),
]
