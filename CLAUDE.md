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
```

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