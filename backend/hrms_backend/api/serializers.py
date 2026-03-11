from rest_framework import serializers
from .models import Department, Employee, LeaveRequest, Attendance

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Department
        fields='__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Employee
        fields='__all__'


class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model=LeaveRequest
        fields='__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Attendance
        fields='__all__'
