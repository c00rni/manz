from django.contrib.auth.models import User
from django.contrib.auth.backends import BaseBackend


class EmailAuthenticationBackend(BaseBackend):
    """
    Custom authentication backend to authenticate users using their email and password.
    """

    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            # Find the user by email
            user = User.objects.get(email=email)
            # Check the password
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
