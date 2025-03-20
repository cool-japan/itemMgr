# Item Management System
# - Item Manager (Django + Vue + Postgres) -

商品管理システム - アイテム情報と会社マスタデータを管理するためのシンプルなアプリケーション

## Specification

* App Framework
  * [Django](https://www.djangoproject.com/) 4.2+
  * [Django REST framework](https://www.django-rest-framework.org/) 3.15+
* Frontend
  * [Vue.JS](https://vuejs.org/) 2.6+
  * [Vue Router](https://router.vuejs.org/) 3.5+
  * [Bootstrap](https://getbootstrap.com/) 5.0+
  * [Axios](https://axios-http.com/) 0.21+
* HTTP server
  * [nginx](https://nginx.org/en/)
* Database
  * [PostgreSQL](https://www.postgresql.org/) 14+

## Architecture

- **Frontend**: Vue.jsベースのSPA（Single Page Application）
- **API**: Django REST Frameworkを使ったRESTful API
- **Database**: PostgreSQLを使ったデータ永続化
- **Containerization**: DockerとDocker Composeを使ったコンテナ環境

## Docker構成

- **web**: DjangoアプリケーションとREST API (ポート 8000)
- **db**: PostgreSQLデータベース (ポート 5433)
- **nginx**: 静的ファイル配信とAPIプロキシ (ポート 80)

## How to use

1. Build (dockerがインストール済みであることを確認してください)

  ```sh
   ./build.sh
  ```

2. Run

  ```sh
   docker-compose up -d
  ```

3. Access

  ブラウザで以下のURLにアクセスしてください:
  
  ```
  http://localhost/
  ```

## 機能

- 会社マスタ管理（追加・編集・削除）
- 商品マスタ管理（追加・編集・削除）
- 商品画像アップロード

## 開発環境

- PostgreSQLが稼働しているローカル環境ではPostgreSQLのポート5432が使用中の場合があります
- その場合は`docker-compose.yml`の中でポートマッピングを5433:5432に変更しています

