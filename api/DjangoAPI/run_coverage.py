import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DjangoAPI.settings')
os.environ['USE_SQLITE_FOR_TESTS'] = 'True'
django.setup()

from ItemApp.models import Items, Companys, Category
from decimal import Decimal

# テストの実行
def run_tests():
    # モデルテスト
    test_models()
    
    # シリアライザテスト
    test_serializers()
    
    print("✅ すべてのテストが成功しました")

def test_models():
    # 会社モデルのテスト
    company = Companys(CompanyName="テスト会社")
    assert str(company) == "テスト会社"
    
    # カテゴリモデルのテスト
    parent = Category(CategoryName="親カテゴリ")
    child = Category(CategoryName="子カテゴリ", ParentCategory=parent)
    assert str(parent) == "親カテゴリ"
    assert str(child) == "子カテゴリ"
    
    # 商品モデルのテスト
    item = Items(
        ItemName="テスト商品",
        Company="テスト会社",
        DateOfJoining="2023-01-01",
        Abstract="テスト商品の説明",
        Price=Decimal("1000.00"),
        PhotoFileName="test.png",
        StockQuantity=10,
        LowStockThreshold=5
    )
    
    # 文字列表現
    assert str(item) == "テスト商品"
    
    # 在庫あり
    assert item.stock_status == "在庫あり"
    assert item.is_in_stock == True
    
    # 在庫僅少
    item.StockQuantity = 3
    assert item.stock_status == "在庫僅少"
    assert item.is_in_stock == True
    
    # 在庫切れ
    item.StockQuantity = 0
    assert item.stock_status == "在庫切れ"
    assert item.is_in_stock == False
    
    print("✓ モデルテスト成功")

def test_serializers():
    # シリアライザのインポート
    from ItemApp.serializers import ItemSerializer, CompanySerializer, CategorySerializer
    
    # CompanySerializerの検証テスト
    valid_company_data = {'CompanyName': 'テスト会社'}
    company_serializer = CompanySerializer(data=valid_company_data)
    assert company_serializer.is_valid()
    
    # 不正なCompanyデータ
    invalid_company_data = {'CompanyName': ''}
    company_serializer = CompanySerializer(data=invalid_company_data)
    assert not company_serializer.is_valid()
    assert 'CompanyName' in company_serializer.errors
    
    print("✓ シリアライザテスト成功")

if __name__ == "__main__":
    run_tests()
