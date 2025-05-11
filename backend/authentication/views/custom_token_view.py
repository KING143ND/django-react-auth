from django.contrib import auth
from rest_framework import status, views
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from authentication.serializers import CustomTokenObtainPairSerializer
from utils.exceptions import format_serializer_error


class CustomTokenObtainPairView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = CustomTokenObtainPairSerializer(data=request.data)

            if not serializer.is_valid():
                return format_serializer_error(serializer.errors)

            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = auth.authenticate(request, email=email, password=password)

            if not user:
                return Response({
                    'message': 'Invalid credentials, please try again',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                refresh = RefreshToken.for_user(user)
                auth.login(request, user)

                data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }

                return Response({
                    'data': data,
                    'message': 'Token generated successfully.',
                    'status': status.HTTP_200_OK
                }, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({
                    'message': f'Failed to generate token, {str(e)}',
                    'status': status.HTTP_400_BAD_REQUEST
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'message': str(e),
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
