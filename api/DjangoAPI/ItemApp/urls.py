from django.urls import path, re_path
from ItemApp import views
from rest_framework_simplejwt.views import TokenRefreshView

from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.get_user_profile, name='user_profile'),
    
    # Public endpoints
    path('public/items/', views.public_items, name='public_items'),
    
    # Protected API endpoints
    re_path(r'^company$', views.companyApi),
    re_path(r'^company/([0-9]+)$', views.companyApi),

    re_path(r'^item$', views.itemApi),
    re_path(r'^item/([0-9]+)$', views.itemApi),
    
    re_path(r'^category$', views.categoryApi),
    re_path(r'^category/([0-9]+)$', views.categoryApi),
    re_path(r'^categories/all$', views.allCategoriesApi),
    
    # 在庫管理に関するエンドポイント
    path('stock/status', views.stock_status, name='stock_status'),
    path('stock/low', views.low_stock_items, name='low_stock_items'),
    path('stock/update/<int:id>', views.update_stock, name='update_stock'),
    
    # 検索API
    path('search', views.search_items, name='search_items'),
    
    # レポートAPI
    path('reports/sales-by-category', views.sales_by_category, name='sales_by_category'),
    path('reports/stock-value', views.stock_value_report, name='stock_value_report'),
    path('reports/inventory-statistics', views.inventory_statistics, name='inventory_statistics'),

    re_path(r'^item/savefile$', views.SaveFile)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)