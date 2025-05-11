from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import exception_handler


def format_serializer_error(errors):
    """
    Returns the first formatted error from a serializer's error dictionary.
    """
    field, messages = next(iter(errors.items()))
    if isinstance(messages, list) and messages:
        formatted_error = f"{field} - {messages[0]}"
    else:
        formatted_error = str(messages)

    return Response({
        'message': formatted_error,
        'status': status.HTTP_400_BAD_REQUEST
    }, status=status.HTTP_400_BAD_REQUEST)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    
    if response is not None and 'detail' in response.data:
        response.data['message'] = response.data.pop('detail')
    return response
