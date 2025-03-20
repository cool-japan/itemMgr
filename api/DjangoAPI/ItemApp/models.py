from django.db import models

# Create your models here.
class Companys(models.Model):
    CompanyId = models.AutoField(primary_key=True)
    CompanyName = models.CharField(max_length=100)
    
    def __str__(self):
        return self.CompanyName

class Category(models.Model):
    CategoryId = models.AutoField(primary_key=True)
    CategoryName = models.CharField(max_length=100)
    Description = models.TextField(blank=True, null=True)
    ParentCategory = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True, related_name='subcategories')
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.CategoryName

class Items(models.Model):
    ItemId = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=100)
    Company = models.CharField(max_length=100)
    Category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True, related_name='items')
    DateOfJoining = models.DateField()
    Abstract = models.TextField()
    Price = models.DecimalField(max_digits=8, decimal_places=2)
    PhotoFileName = models.CharField(max_length=100)
    StockQuantity = models.IntegerField(default=0)
    LowStockThreshold = models.IntegerField(default=5)
    
    def __str__(self):
        return self.ItemName
    
    @property
    def is_in_stock(self):
        return self.StockQuantity > 0
        
    @property
    def stock_status(self):
        if self.StockQuantity <= 0:
            return "在庫切れ"
        elif self.StockQuantity <= self.LowStockThreshold:
            return "在庫僅少"
        else:
            return "在庫あり"
