#!/bin/bash

# テストを実行するスクリプト
cd /tmp/itemMgr/api/DjangoAPI

# テスト実行
echo "テストを実行中..."
python manage.py test ItemApp

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
  coverage run --source='ItemApp' manage.py test ItemApp
  coverage report
  coverage html -d /tmp/itemMgr/coverage_html
  echo "HTMLカバレッジレポートが /tmp/itemMgr/coverage_html に生成されました"
else
  echo "カバレッジレポート生成をスキップします（coverage がインストールされていません）"
  echo "カバレッジレポートを有効にするには: pip install coverage"
fi

exit $TEST_RESULT