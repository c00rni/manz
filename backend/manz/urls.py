from django.urls import path
from .views import UserRegistrationView, EmailAuthTokenView, RecipeCreateView

app_name = "manz"
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='api-register'),
    path('login/', EmailAuthTokenView.as_view(), name='api-authentification'),
    path('recipe/', RecipeCreateView.as_view(), name='api-recipe')
]
