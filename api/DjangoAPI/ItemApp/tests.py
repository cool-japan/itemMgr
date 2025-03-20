from django.test import TestCase
from django.urls import reverse
from django.db import models
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Companys, Category, Items
from .serializers import CompanySerializer, CategorySerializer, ItemSerializer
from decimal import Decimal
import json

class ModelTests(TestCase):
    """モデルのテストケース"""
    
    # djangoのテスト時に自動でトランザクション管理とマイグレーションを行う設定
    databases = "__all__"
    
    def setUp(self):
        """テスト用データのセットアップ"""
        # 会社の作成
        self.company = Companys.objects.create(CompanyName="テスト会社")
        
        # カテゴリの作成
        self.parent_category = Category.objects.create(
            CategoryName="親カテゴリ",
            Description="親カテゴリの説明"
        )
        
        self.child_category = Category.objects.create(
            CategoryName="子カテゴリ",
            Description="子カテゴリの説明",
            ParentCategory=self.parent_category
        )
        
        # 商品の作成
        self.item = Items.objects.create(
            ItemName="テスト商品",
            Company="テスト会社",
            Category=self.child_category,
            DateOfJoining="2023-01-01",
            Abstract="テスト商品の説明",
            Price=Decimal("1000.00"),
            PhotoFileName="test.png",
            StockQuantity=10,
            LowStockThreshold=5
        )
    
    def test_company_str(self):
        """会社モデルの文字列表現をテスト"""
        self.assertEqual(str(self.company), "テスト会社")
    
    def test_category_str(self):
        """カテゴリモデルの文字列表現をテスト"""
        self.assertEqual(str(self.parent_category), "親カテゴリ")
        self.assertEqual(str(self.child_category), "子カテゴリ")
    
    def test_item_str(self):
        """商品モデルの文字列表現をテスト"""
        self.assertEqual(str(self.item), "テスト商品")
    
    def test_item_stock_status(self):
        """商品モデルの在庫状態プロパティをテスト"""
        # 在庫あり
        self.item.StockQuantity = 10
        self.item.LowStockThreshold = 5
        self.assertEqual(self.item.stock_status, "在庫あり")
        self.assertTrue(self.item.is_in_stock)
        
        # 在庫僅少
        self.item.StockQuantity = 3
        self.assertEqual(self.item.stock_status, "在庫僅少")
        self.assertTrue(self.item.is_in_stock)
        
        # 在庫切れ
        self.item.StockQuantity = 0
        self.assertEqual(self.item.stock_status, "在庫切れ")
        self.assertFalse(self.item.is_in_stock)

class SerializerTests(TestCase):
    """シリアライザのテストケース"""
    
    # djangoのテスト時に自動でトランザクション管理とマイグレーションを行う設定
    databases = "__all__"
    
    def setUp(self):
        """テスト用データのセットアップ"""
        # カテゴリの作成
        self.parent_category = Category.objects.create(
            CategoryName="親カテゴリ",
            Description="親カテゴリの説明"
        )
        
        self.child_category = Category.objects.create(
            CategoryName="子カテゴリ",
            Description="子カテゴリの説明",
            ParentCategory=self.parent_category
        )
    
    def test_company_serializer_validation(self):
        """会社シリアライザのバリデーションをテスト"""
        # 正常なデータ
        valid_data = {'CompanyName': 'テスト会社'}
        serializer = CompanySerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        
        # 不正なデータ（空の会社名）
        invalid_data = {'CompanyName': ''}
        serializer = CompanySerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('CompanyName', serializer.errors)
    
    def test_category_serializer(self):
        """カテゴリシリアライザをテスト"""
        serializer = CategorySerializer(self.child_category)
        data = serializer.data
        
        self.assertEqual(data['CategoryName'], "子カテゴリ")
        self.assertEqual(data['Description'], "子カテゴリの説明")
        self.assertEqual(data['parent_name'], "親カテゴリ")
    
    def test_item_serializer_validation(self):
        """商品シリアライザのバリデーションをテスト"""
        # 正常なデータ
        valid_data = {
            'ItemName': 'テスト商品',
            'Company': 'テスト会社',
            'Category': self.child_category.CategoryId,
            'DateOfJoining': '2023-01-01',
            'Abstract': 'テスト商品の説明',
            'Price': '1000.00',
            'PhotoFileName': 'test.png',
            'StockQuantity': 10,
            'LowStockThreshold': 5
        }
        serializer = ItemSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())
        
        # 不正なデータ（マイナスの在庫数）
        invalid_data = valid_data.copy()
        invalid_data['StockQuantity'] = -1
        serializer = ItemSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('StockQuantity', serializer.errors)
        
        # 不正なデータ（マイナスの価格）
        invalid_data = valid_data.copy()
        invalid_data['Price'] = -100
        serializer = ItemSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Price', serializer.errors)

class APITests(APITestCase):
    """APIエンドポイントのテストケース"""
    
    # djangoのテスト時に自動でトランザクション管理とマイグレーションを行う設定
    databases = "__all__"
    
    def setUp(self):
        """テスト用データのセットアップ"""
        # テストユーザーの作成
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        
        # JWT認証トークンの取得
        refresh = RefreshToken.for_user(self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        # カテゴリの作成
        self.category = Category.objects.create(
            CategoryName="テストカテゴリ",
            Description="テストカテゴリの説明"
        )
        
        # 商品の作成
        self.item = Items.objects.create(
            ItemName="テスト商品",
            Company="テスト会社",
            Category=self.category,
            DateOfJoining="2023-01-01",
            Abstract="テスト商品の説明",
            Price=Decimal("1000.00"),
            PhotoFileName="test.png",
            StockQuantity=10,
            LowStockThreshold=5
        )
        
        # 会社の作成
        self.company = Companys.objects.create(CompanyName="テスト会社")
    
    def test_company_api(self):
        """会社APIをテスト"""
        # 一覧取得
        response = self.client.get('/company')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # 新規作成
        data = {'CompanyName': '新しい会社'}
        response = self.client.post('/company', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Companys.objects.count(), 2)
        
        # 更新
        company_id = Companys.objects.get(CompanyName='新しい会社').CompanyId
        data = {'CompanyId': company_id, 'CompanyName': '更新された会社'}
        response = self.client.put('/company', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Companys.objects.get(CompanyId=company_id).CompanyName, '更新された会社')
        
        # 削除
        response = self.client.delete(f'/company/{company_id}')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Companys.objects.count(), 1)
    
    def test_category_api(self):
        """カテゴリAPIをテスト"""
        # 一覧取得
        response = self.client.get('/category')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 詳細取得
        response = self.client.get(f'/category/{self.category.CategoryId}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['CategoryName'], 'テストカテゴリ')
    
    def test_item_api(self):
        """商品APIをテスト"""
        # 一覧取得
        response = self.client.get('/item')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
        # 新規作成
        data = {
            'ItemName': '新しい商品',
            'Company': 'テスト会社',
            'Category': self.category.CategoryId,
            'DateOfJoining': '2023-01-01',
            'Abstract': '新しい商品の説明',
            'Price': '2000.00',
            'PhotoFileName': 'new.png',
            'StockQuantity': 20,
            'LowStockThreshold': 5
        }
        response = self.client.post('/item', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Items.objects.count(), 2)
    
    def test_search_api(self):
        """検索APIをテスト"""
        # キーワード検索
        response = self.client.get('/search?q=テスト')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        
        # カテゴリ検索
        response = self.client.get(f'/search?category={self.category.CategoryId}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        
        # 価格範囲検索
        response = self.client.get('/search?min_price=500&max_price=1500')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        
        # 在庫状態検索
        response = self.client.get('/search?stock_status=in_stock')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
    
    def test_stock_management_api(self):
        """在庫管理APIをテスト"""
        # 在庫状態の取得
        response = self.client.get('/stock/status')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_items'], 1)
        
        # 在庫数の更新
        data = {'quantity_change': 5}
        response = self.client.post(f'/stock/update/{self.item.ItemId}', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item.refresh_from_db()
        self.assertEqual(self.item.StockQuantity, 15)
        
        # 在庫僅少商品の取得
        self.item.StockQuantity = 3
        self.item.save()
        response = self.client.get('/stock/low')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_report_api(self):
        """レポートAPIをテスト"""
        # 在庫統計レポート
        response = self.client.get('/reports/inventory-statistics')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # カテゴリ別レポート
        response = self.client.get('/reports/sales-by-category')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 在庫価値レポート
        response = self.client.get('/reports/stock-value')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
