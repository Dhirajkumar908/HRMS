from django.shortcuts import render
from rest_framework import viewsets
from .models import Department, Employee, LeaveRequest, Attendance
from .serializers import DepartmentSerializer, EmployeeSerializer, LeaveRequestSerializer, AttendanceSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone


# Create your views here.

class DepartmentViewSets(viewsets.ModelViewSet):
    queryset=Department.objects.all()
    serializer_class=DepartmentSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer



@api_view(['GET'])
def dashboard_stats(request):
    
    today = timezone.now().date()

    total_employees = Employee.objects.count()
    
    total_departments = Department.objects.count()
    
    total_leaves = LeaveRequest.objects.count()
    pending_leaves = LeaveRequest.objects.filter(status='Pending').count()
    
    present_today = Attendance.objects.filter(date=today, status='Present').count()
    absent_today = Attendance.objects.filter(date=today, status='Absent').count()
    
    return Response({
        'total_employees': total_employees,
        'total_departments': total_departments,
        'total_leaves': total_leaves,
        'pending_leaves': pending_leaves,
        'present_today': present_today,
        'absent_today': absent_today
    })