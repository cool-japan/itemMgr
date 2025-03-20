# Claude's Usage Guide for ItemMgr Project

## Testing Commands

```bash
# Djangoのユニットテスト実行
cd /tmp/itemMgr/api/DjangoAPI
python manage.py test ItemApp

# カバレッジレポート生成
cd /tmp/itemMgr/api/DjangoAPI
coverage run --source='ItemApp' manage.py test ItemApp
coverage report
coverage html -d /tmp/itemMgr/coverage_html

# テスト自動実行スクリプト
/tmp/itemMgr/run_tests.sh

# モデル変更後のマイグレーション作成
cd /tmp/itemMgr/api/DjangoAPI
python manage.py makemigrations
```

### テスト実行時の注意点

- テスト実行時は `run_tests.sh` スクリプトを使用すると、マイグレーションやカバレッジの設定が自動的に行われます
- 現在のテストカバレッジは約72%です
- APIエンドポイントのテスト時はURLパスに `/api/` プレフィックスを使用しないでください

## Project Structure

This is an inventory management system built with:
- Backend: Django REST Framework (API)
- Frontend: Vue.js
- Database: MySQL/PostgreSQL
- Authentication: JWT

The main components are:
- Item management
- Category management 
- Company management
- Stock/inventory tracking
- Search functionality
- Reporting and statistics

## Coding Style

- CamelCase for model fields
- snake_case for variables and functions
- Japanese comments and UI text (日本語)
- English code