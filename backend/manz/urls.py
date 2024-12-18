from django.urls import path
from .views import UserRegistrationView, EmailAuthTokenView

app_name = "manz"
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='api-register'),
    path('login/', EmailAuthTokenView.as_view(), name='api-authentification'),
]
