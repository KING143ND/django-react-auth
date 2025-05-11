from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from authentication.serializers import UserSerializer
from utils.exceptions import format_serializer_error


class SignUpView(APIView):
    """
    API endpoint for registering a new user.
    """
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return format_serializer_error(serializer.errors)

        email = serializer.validated_data['email']

        try:
            if User.objects.filter(email=email).exists():
                return Response({
                    "message": "Email already registered.",
                    "status": status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=email,
                email=email,
                password=serializer.validated_data['password'],
            )
            
            return Response({
                'data': {
                    'id': user.id,
                    'email': user.email
                },
                'status': status.HTTP_201_CREATED,
                'message': 'User created successfully.'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            if 'user' in locals():
                user.delete()
            return Response({
                "message": f"Internal server error: {str(e)}",
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
