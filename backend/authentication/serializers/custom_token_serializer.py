from rest_framework import serializers


class CustomTokenObtainPairSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, value):
        """
        Check that the email provided is valid.
        """
        if not value:
            raise serializers.ValidationError("An email address is required.")
        return value

    def validate_password(self, value):
        """
        Check that the password is provided.
        """
        if not value:
            raise serializers.ValidationError("A password is required.")
        return value