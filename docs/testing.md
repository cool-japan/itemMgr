# テスト実行ガイド

このプロジェクトには自動テストが実装されており、以下の方法で実行できます。

## 手動でのテスト実行

### 基本的なテスト実行

```bash
cd /tmp/itemMgr/api/DjangoAPI
python manage.py test ItemApp
```

### カバレッジレポート付きのテスト実行

```bash
# coverageのインストール（初回のみ）
pip install coverage

# テスト実行とカバレッジレポート生成
cd /tmp/itemMgr/api/DjangoAPI
coverage run --source='ItemApp' manage.py test ItemApp
coverage report
```

HTMLレポートを生成する場合:

```bash
coverage html -d /tmp/itemMgr/coverage_html
```

## 自動テスト実行

テスト実行用スクリプトを使用すると、テストとカバレッジレポート生成を一度に行えます:

```bash
/tmp/itemMgr/run_tests.sh
```

## CI/CD パイプライン

GitHub Actions を使用して、プッシュやプルリクエスト時に自動的にテストが実行されます。
設定ファイルは `.github/workflows/django-tests.yml` にあります。

## テストの構成

テストは以下のカテゴリに分かれています:

1. **ModelTests**: モデルの機能と関係のテスト
2. **SerializerTests**: シリアライザのバリデーションと変換のテスト
3. **APITests**: APIエンドポイントの動作テスト

## テストの追加方法

新しい機能を追加した場合は、対応するテストも追加してください。

### モデルテストの追加例

```python
def test_new_model_feature(self):
    """新機能のテスト"""
    # テストコードを記述
    self.assertEqual(expected_result, actual_result)
```

### APIテストの追加例

```python
def test_new_api_endpoint(self):
    """新APIエンドポイントのテスト"""
    response = self.client.get('/api/new_endpoint')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    # レスポンスの内容を検証
```