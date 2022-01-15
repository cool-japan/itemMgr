from django.db import models

# Create your models here.

class Companys(models.Model):
    CompanyId = models.AutoField(primary_key=True)
    CompanyName = models.CharField(max_length=100)

class Items(models.Model):
    ItemId = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=100)
    Company = models.CharField(max_length=100)
    DateOfJoining = models.DateField()
    Abstract = models.TextField()
    Price = models.DecimalField(max_digits=8, decimal_places=2)
    PhotoFileName = models.CharField(max_length=100)
