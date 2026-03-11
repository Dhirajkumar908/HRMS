from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSets, 
    EmployeeViewSet, 
    LeaveRequestViewSet, 
    AttendanceViewSet,
    dashboard_stats
)

# 1. Create a router
router = DefaultRouter()

router.register(r'departments', DepartmentViewSets)
router.register(r'employees', EmployeeViewSet)
router.register(r'leaves', LeaveRequestViewSet)
router.register(r'attendance', AttendanceViewSet)

# 3. Add the router URLs to urlpatterns
urlpatterns = [
    path('dashboard-stats/', dashboard_stats, name='dashboard-stats'),
    path('', include(router.urls)), 
]