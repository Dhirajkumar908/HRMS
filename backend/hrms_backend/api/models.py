from django.db import models

# Create your models here.

class Department(models.Model):
    name=models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Employee(models.Model):
    first_name=models.CharField(max_length=50)
    last_name=models.CharField(max_length=50)
    email=models.EmailField(unique=True)
    designation=models.CharField(max_length=100)
    department=models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employee')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    
    
class LeaveRequest(models.Model):
    STATUS_CHOISE=[
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ]

    employee=models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    start_date=models.DateField()
    end_date=models.DateField()
    reason=models.TextField()
    status=models.CharField(max_length=20, choices=STATUS_CHOISE, default='Pending')



class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Present')

    def __str__(self):
        return f"{self.employee.first_name} - {self.date} - {self.status}"