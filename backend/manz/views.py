from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .serializers import (
    RecipeSerializer,
    MealSerializer,
    UserRegistrationSerializer
)
from .models import Meal
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware


class UserRegistrationView(APIView):
    """
    API View to handle user registration.
    """
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permissions required

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        messages = ["User registered successfully"]
        response_code = status.HTTP_201_CREATED
        if serializer.is_valid():
            serializer.save()
        else:
            messages = [error.title()
                        for error in serializer.errors]
            response_code = status.HTTP_400_BAD_REQUEST
        return Response({"message": messages}, status=response_code)


class EmailAuthTokenView(APIView):
    """
    API View to handle user authentification.
    """
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permissions required

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = authenticate(email=email, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response(
            {'error': 'Invalid email or password.'},
            status=status.HTTP_403_FORBIDDEN,
        )


class RecipeCreateView(APIView):
    """
    API View to handle recipes.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['user'] = request.user.id

        serializer = RecipeSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleMealView(APIView):
    """
    API View to handle meals.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['user'] = request.user.id

        serializer = MealSerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MealView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        start_date_param = request.query_params.get('start_date')
        end_date_param = request.query_params.get('end_date')

        if not start_date_param or not end_date_param:
            return Response(
                {"error": "Both 'start_date' and 'end_date' query parameters are required."},
                status=400
            )

        try:
            start_date = parse_datetime(start_date_param)
            end_date = parse_datetime(end_date_param)
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid date format. Use ISO 8601 format (e.g., '2025-01-01T00:00:00Z')."},
                status=400
            )

        meals = Meal.objects.filter(
            user=user,
            start_date__gte=start_date,
            start_date__lt=end_date
        )

        serializer = MealSerializer(meals, many=True)

        return Response(serializer.data)
