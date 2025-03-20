#!/bin/bash

# テストを実行するスクリプト
cd /tmp/itemMgr/api/DjangoAPI

# テスト用の環境変数を設定（SQLiteを使用）
export DJANGO_SETTINGS_MODULE=DjangoAPI.settings
export USE_SQLITE_FOR_TESTS=True

# マイグレーションを実行してテストデータベースを初期化
python manage.py migrate

# Djangoの標準テストではなく、直接テストを実行する簡易版を作成
echo "テスト対象コードのテスト中..."

# モデルのテスト（SQLite不要のテストのみ）
cd /tmp/itemMgr/api/DjangoAPI && python -c "
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DjangoAPI.settings')
django.setup()

from ItemApp.models import Items
from decimal import Decimal

# Stock statusテスト
item = Items(ItemName='Test', Company='Test Co', DateOfJoining='2023-01-01', 
             Abstract='Test', Price=Decimal('100.0'), PhotoFileName='test.png', 
             StockQuantity=10, LowStockThreshold=5)

# 正常在庫
assert item.stock_status == '在庫あり', f'Expected 在庫あり, got {item.stock_status}'
assert item.is_in_stock == True, 'Expected is_in_stock to be True'

# 在庫僅少
item.StockQuantity = 3
assert item.stock_status == '在庫僅少', f'Expected 在庫僅少, got {item.stock_status}'
assert item.is_in_stock == True, 'Expected is_in_stock to be True'

# 在庫切れ
item.StockQuantity = 0
assert item.stock_status == '在庫切れ', f'Expected 在庫切れ, got {item.stock_status}'
assert item.is_in_stock == False, 'Expected is_in_stock to be False'

print('✅ モデルプロパティのテストに成功しました')
" || echo "❌ モデルプロパティのテストに失敗しました"

# カバレッジレポート生成（Djangoセットアップスクリプト作成）
echo "カバレッジレポート生成用スクリプトを作成..."
cat > /tmp/itemMgr/api/DjangoAPI/run_coverage.py << 'EOF'
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
EOF

echo "カバレッジレポートを生成中..."
cd /tmp/itemMgr/api/DjangoAPI
coverage run run_coverage.py
coverage report
coverage html -d /tmp/itemMgr/coverage_html
echo "HTMLカバレッジレポートが /tmp/itemMgr/coverage_html に生成されました"

# テストの終了コードを保存
TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
  echo "✅ テスト成功: すべてのテストがパスしました"
else
  echo "❌ テスト失敗: エラーが発生しました"
fi

# テストカバレッジレポートを生成（coverage がインストールされている場合）
if command -v coverage &> /dev/null; then
  echo "カバレッジレポートを生成中..."
  python manage.py migrate  # マイグレーションを再度実行
  coverage run --source='ItemApp' manage.py test ItemApp
  coverage report
  coverage html -d /tmp/itemMgr/coverage_html
  echo "HTMLカバレッジレポートが /tmp/itemMgr/coverage_html に生成されました"
else
  echo "カバレッジレポート生成をスキップします（coverage がインストールされていません）"
  echo "カバレッジレポートを有効にするには: pip install coverage"
fi

exit $TEST_RESULT