from collections import Counter
from rest_framework.views import APIView
from rest_framework.response import Response
from authentication.models import OtpStore
from django.contrib.auth.models import User
from datetime import timedelta
from django.utils import timezone


class DashboardView(APIView):
    def get(self, request):
        today = timezone.now()
        start_of_week = today - timedelta(days=7)

        total_users = User.objects.count()
        total_otps = OtpStore.objects.count()
        active_users = User.objects.filter(last_login__gte=today - timedelta(days=1)).count()
        signups_this_week = User.objects.filter(date_joined__gte=today - timedelta(weeks=1)).count()

        recent_otps = OtpStore.objects.filter(created_at__gte=start_of_week)

        weekday_counts = Counter([otp.created_at.weekday() for otp in recent_otps])

        weekday_map = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        chart_data = [
            {"name": weekday_map[i], "value": weekday_counts.get(i, 0)} for i in range(7)
        ]

        data = {
            "totalUsers": total_users,
            "totalOTPs": total_otps,
            "activeUsers": active_users,
            "signupsThisWeek": signups_this_week,
            "chartData": chart_data,
        }

        return Response(data)
