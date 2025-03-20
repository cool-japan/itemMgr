from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from ItemApp.models import Companys, Items, Category
from django.contrib.auth.models import User
from ItemApp.serializers import (
    CompanySerializer, ItemSerializer, UserSerializer, CustomTokenObtainPairSerializer,
    CategorySerializer, CategoryDetailSerializer
)

from django.core.files.storage import default_storage

# User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

# Custom Token Obtain Pair View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# User Profile View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

# Company API views with JWT authentication
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def companyApi(request, id=0):
    if request.method == 'GET':
        companys = Companys.objects.all()
        companys_serializer = CompanySerializer(companys, many=True)
        return Response(companys_serializer.data)
    
    elif request.method == 'POST':
        try:
            companys_serializer = CompanySerializer(data=request.data)
            if companys_serializer.is_valid():
                companys_serializer.save()
                return Response({"message": "正常に追加されました！"}, status=status.HTTP_201_CREATED)
            
            # バリデーションエラーの整形
            error_messages = {}
            for field, errors in companys_serializer.errors.items():
                if field == 'CompanyName' and 'This field may not be blank.' in str(errors):
                    error_messages[field] = '会社名は必須項目です。'
                elif field == 'non_field_errors':
                    error_messages['全般'] = errors
                else:
                    error_messages[field] = errors
            
            return Response({"errors": error_messages, "message": "入力内容に問題があります。修正してください。"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("会社追加エラー:", str(e))
            print(traceback.format_exc())
            return Response({"errors": {"全般": "予期せぬエラーが発生しました。"}, 
                            "message": f"会社登録中にエラーが発生しました: {str(e)}"}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            company = Companys.objects.get(CompanyId=request.data['CompanyId'])
        except Companys.DoesNotExist:
            return Response({"message": "会社が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            companys_serializer = CompanySerializer(company, data=request.data)
            if companys_serializer.is_valid():
                companys_serializer.save()
                return Response({"message": "正常に更新されました！"})
            
            # バリデーションエラーの整形
            error_messages = {}
            for field, errors in companys_serializer.errors.items():
                if field == 'CompanyName' and 'This field may not be blank.' in str(errors):
                    error_messages[field] = '会社名は必須項目です。'
                elif field == 'non_field_errors':
                    error_messages['全般'] = errors
                else:
                    error_messages[field] = errors
            
            return Response({"errors": error_messages, "message": "入力内容に問題があります。修正してください。"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("会社更新エラー:", str(e))
            print(traceback.format_exc())
            return Response({"errors": {"全般": "予期せぬエラーが発生しました。"}, 
                            "message": f"会社更新中にエラーが発生しました: {str(e)}"}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        try:
            company = Companys.objects.get(CompanyId=id)
            company.delete()
            return Response({"message": "正常に削除されました！"}, status=status.HTTP_204_NO_CONTENT)
        except Companys.DoesNotExist:
            return Response({"message": "会社が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

# Item API views with JWT authentication
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def itemApi(request, id=0):
    if request.method == 'GET':
        items = Items.objects.all()
        items_serializer = ItemSerializer(items, many=True)
        return Response(items_serializer.data)
    
    elif request.method == 'POST':
        try:
            print("リクエストデータ:", request.data)
            items_serializer = ItemSerializer(data=request.data)
            if items_serializer.is_valid():
                items_serializer.save()
                return Response({"message": "正常に追加されました！"}, status=status.HTTP_201_CREATED)
            
            # バリデーションエラーの整形
            print("バリデーションエラー:", items_serializer.errors)
            error_messages = {}
            for field, errors in items_serializer.errors.items():
                if field == 'Abstract' and 'This field may not be blank.' in str(errors):
                    error_messages[field] = '概要は必須項目です。商品の説明を入力してください。'
                elif field == 'non_field_errors':
                    error_messages['全般'] = errors
                else:
                    error_messages[field] = errors
            
            return Response({"errors": error_messages, "message": "入力内容に問題があります。修正してください。"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("商品追加エラー:", str(e))
            print(traceback.format_exc())
            return Response({"errors": {"全般": "予期せぬエラーが発生しました。"}, 
                            "message": f"商品登録中にエラーが発生しました: {str(e)}"}, 
                           status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            item = Items.objects.get(ItemId=request.data['ItemId'])
        except Items.DoesNotExist:
            return Response({"message": "商品が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
        except KeyError:
            return Response({"errors": {"ItemId": "商品IDが指定されていません"}, 
                            "message": "商品IDが必要です"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        items_serializer = ItemSerializer(item, data=request.data)
        if items_serializer.is_valid():
            items_serializer.save()
            return Response({"message": "正常に更新されました！"})
            
        # バリデーションエラーの整形
        error_messages = {}
        for field, errors in items_serializer.errors.items():
            if field == 'Abstract' and 'This field may not be blank.' in str(errors):
                error_messages[field] = '概要は必須項目です。商品の説明を入力してください。'
            elif field == 'non_field_errors':
                error_messages['全般'] = errors
            else:
                error_messages[field] = errors
        
        return Response({"errors": error_messages, "message": "入力内容に問題があります。修正してください。"}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        try:
            item = Items.objects.get(ItemId=id)
            item.delete()
            return Response({"message": "正常に削除されました！"}, status=status.HTTP_204_NO_CONTENT)
        except Items.DoesNotExist:
            return Response({"message": "商品が見つかりません"}, status=status.HTTP_404_NOT_FOUND)

# Create a public endpoint for item listing
@api_view(['GET'])
@permission_classes([AllowAny])
def public_items(request):
    items = Items.objects.all()
    items_serializer = ItemSerializer(items, many=True)
    return Response(items_serializer.data)

# Search API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_items(request):
    """アイテム検索API - クエリパラメータをサポート:
    - q: 全文検索キーワード（商品名、概要、会社名）
    - category: カテゴリID
    - min_price: 最小価格
    - max_price: 最大価格
    - stock_status: 在庫状態（in_stock, low_stock, out_of_stock）
    """
    query = request.query_params.get('q', '')
    category_id = request.query_params.get('category', None)
    min_price = request.query_params.get('min_price', None)
    max_price = request.query_params.get('max_price', None)
    stock_status = request.query_params.get('stock_status', None)
    
    # ベースクエリ
    items = Items.objects.all()
    
    # 全文検索（商品名、概要、会社名）
    if query:
        items = items.filter(
            models.Q(ItemName__icontains=query) | 
            models.Q(Abstract__icontains=query) | 
            models.Q(Company__icontains=query)
        )
    
    # カテゴリフィルタ
    if category_id and category_id.isdigit():
        try:
            category = Category.objects.get(CategoryId=category_id)
            # サブカテゴリも含める
            category_ids = [category.CategoryId]
            subcategories = category.subcategories.all()
            category_ids.extend([subcat.CategoryId for subcat in subcategories])
            items = items.filter(Category__in=category_ids)
        except Category.DoesNotExist:
            pass
    
    # 価格範囲フィルタ
    if min_price and min_price.replace('.', '', 1).isdigit():
        items = items.filter(Price__gte=float(min_price))
    
    if max_price and max_price.replace('.', '', 1).isdigit():
        items = items.filter(Price__lte=float(max_price))
    
    # 在庫状態フィルタ
    if stock_status:
        if stock_status == 'out_of_stock':
            items = items.filter(StockQuantity=0)
        elif stock_status == 'low_stock':
            items = items.filter(StockQuantity__gt=0, StockQuantity__lte=models.F('LowStockThreshold'))
        elif stock_status == 'in_stock':
            items = items.filter(StockQuantity__gt=models.F('LowStockThreshold'))
    
    serializer = ItemSerializer(items, many=True)
    return Response({
        'count': items.count(),
        'results': serializer.data
    })

# Category API views with JWT authentication
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def categoryApi(request, id=0):
    if request.method == 'GET':
        if id != 0:
            try:
                category = Category.objects.get(CategoryId=id)
                category_serializer = CategoryDetailSerializer(category)
                return Response(category_serializer.data)
            except Category.DoesNotExist:
                return Response({"message": "カテゴリが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Parent categories only (for top level view)
            categories = Category.objects.filter(ParentCategory__isnull=True)
            categories_serializer = CategorySerializer(categories, many=True)
            return Response(categories_serializer.data)
    
    elif request.method == 'POST':
        try:
            category_serializer = CategorySerializer(data=request.data)
            if category_serializer.is_valid():
                category_serializer.save()
                return Response({"message": "カテゴリが正常に追加されました！"}, status=status.HTTP_201_CREATED)
            
            # バリデーションエラーの整形
            error_messages = {}
            for field, errors in category_serializer.errors.items():
                if field == 'CategoryName' and 'This field may not be blank.' in str(errors):
                    error_messages[field] = 'カテゴリ名は必須項目です。'
                elif field == 'non_field_errors':
                    error_messages['全般'] = errors
                else:
                    error_messages[field] = errors
            
            return Response({"errors": error_messages, "message": "入力内容に問題があります。修正してください。"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("カテゴリ追加エラー:", str(e))
            print(traceback.format_exc())
            return Response({"errors": {"全般": "予期せぬエラーが発生しました。"}, 
                            "message": f"カテゴリ登録中にエラーが発生しました: {str(e)}"}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            category = Category.objects.get(CategoryId=request.data['CategoryId'])
        except Category.DoesNotExist:
            return Response({"message": "カテゴリが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            category_serializer = CategorySerializer(category, data=request.data)
            if category_serializer.is_valid():
                category_serializer.save()
                return Response({"message": "カテゴリが正常に更新されました！"})
            
            # バリデーションエラーの整形
            error_messages = {}
            for field, errors in category_serializer.errors.items():
                if field == 'CategoryName' and 'This field may not be blank.' in str(errors):
                    error_messages[field] = 'カテゴリ名は必須項目です。'
                elif field == 'non_field_errors':
                    error_messages['全般'] = errors
                else:
                    error_messages[field] = errors
            
            return Response({"errors": error_messages, "message": "入力内容に問題があります。修正してください。"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print("カテゴリ更新エラー:", str(e))
            print(traceback.format_exc())
            return Response({"errors": {"全般": "予期せぬエラーが発生しました。"}, 
                            "message": f"カテゴリ更新中にエラーが発生しました: {str(e)}"}, 
                          status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        try:
            category = Category.objects.get(CategoryId=id)
            # Check if this category has subcategories
            if category.subcategories.count() > 0:
                return Response({"message": "このカテゴリにはサブカテゴリがあるため削除できません。"}, 
                                status=status.HTTP_400_BAD_REQUEST)
            # Check if this category has items
            if category.items.count() > 0:
                return Response({"message": "このカテゴリには商品があるため削除できません。"}, 
                                status=status.HTTP_400_BAD_REQUEST)
                
            category.delete()
            return Response({"message": "カテゴリが正常に削除されました！"}, status=status.HTTP_204_NO_CONTENT)
        except Category.DoesNotExist:
            return Response({"message": "カテゴリが見つかりません"}, status=status.HTTP_404_NOT_FOUND)

# Get all categories (for dropdowns)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allCategoriesApi(request):
    categories = Category.objects.all()
    categories_serializer = CategorySerializer(categories, many=True)
    return Response(categories_serializer.data)

# Stock management endpoints
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_status(request):
    """商品の在庫状況の概要を取得"""
    total_items = Items.objects.count()
    out_of_stock = Items.objects.filter(StockQuantity=0).count()
    low_stock = Items.objects.filter(StockQuantity__gt=0, StockQuantity__lte=models.F('LowStockThreshold')).count()
    in_stock = total_items - out_of_stock - low_stock
    
    return Response({
        'total_items': total_items,
        'out_of_stock': out_of_stock,
        'low_stock': low_stock,
        'in_stock': in_stock,
        'out_of_stock_percentage': round((out_of_stock / total_items * 100), 1) if total_items > 0 else 0,
        'low_stock_percentage': round((low_stock / total_items * 100), 1) if total_items > 0 else 0,
        'in_stock_percentage': round((in_stock / total_items * 100), 1) if total_items > 0 else 0,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def low_stock_items(request):
    """在庫僅少と在庫切れの商品一覧を取得"""
    items = Items.objects.filter(
        models.Q(StockQuantity=0) | 
        models.Q(StockQuantity__gt=0, StockQuantity__lte=models.F('LowStockThreshold'))
    ).order_by('StockQuantity')
    
    items_serializer = ItemSerializer(items, many=True)
    return Response(items_serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_stock(request, id):
    """商品の在庫数を更新するエンドポイント"""
    try:
        item = Items.objects.get(ItemId=id)
    except Items.DoesNotExist:
        return Response({"message": "商品が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    
    # 在庫数の増減を処理
    quantity_change = request.data.get('quantity_change', 0)
    if not isinstance(quantity_change, int):
        try:
            quantity_change = int(quantity_change)
        except (ValueError, TypeError):
            return Response({"errors": {"quantity_change": "数値を入力してください"}, 
                            "message": "在庫数の変更値は整数で指定してください。"}, 
                           status=status.HTTP_400_BAD_REQUEST)
    
    # 在庫数がマイナスにならないことを確認
    new_quantity = item.StockQuantity + quantity_change
    if new_quantity < 0:
        return Response({"errors": {"quantity_change": "在庫数が不足しています"}, 
                        "message": f"現在の在庫数は{item.StockQuantity}です。{abs(quantity_change)}個の減少はできません。"}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # 在庫数を更新
    item.StockQuantity = new_quantity
    item.save()
    
    # 更新した商品の情報を返す
    serializer = ItemSerializer(item)
    return Response({
        "message": f"在庫数を更新しました。現在の在庫数: {item.StockQuantity}",
        "item": serializer.data
    })

# Reports API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_by_category(request):
    """カテゴリ別の商品数と価格合計のレポート"""
    # 以下は仮のデータモデルに基づいた集計方法です
    # 実際の売上データがある場合は、そのモデルからの集計に変更してください
    
    # カテゴリ別に商品を集計
    categories = Category.objects.all()
    result = []
    
    for category in categories:
        # カテゴリに属する商品を取得
        items = Items.objects.filter(Category=category.CategoryId)
        
        # 集計
        item_count = items.count()
        total_value = sum(item.Price * item.StockQuantity for item in items)
        
        # 子カテゴリがある場合は含める
        subcategories = []
        for subcat in category.subcategories.all():
            sub_items = Items.objects.filter(Category=subcat.CategoryId)
            sub_count = sub_items.count()
            sub_value = sum(item.Price * item.StockQuantity for item in sub_items)
            
            subcategories.append({
                'id': subcat.CategoryId,
                'name': subcat.CategoryName,
                'item_count': sub_count,
                'total_value': float(sub_value)
            })
        
        result.append({
            'id': category.CategoryId,
            'name': category.CategoryName,
            'item_count': item_count,
            'total_value': float(total_value),
            'subcategories': subcategories
        })
    
    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_value_report(request):
    """在庫価値レポート - 商品の現在の在庫価値を計算"""
    items = Items.objects.all()
    
    # 合計在庫価値を計算
    total_stock_value = sum(item.Price * item.StockQuantity for item in items)
    
    # 在庫状態別の価値を計算
    out_of_stock_value = sum(
        item.Price * item.StockQuantity 
        for item in items.filter(StockQuantity=0)
    )
    
    low_stock_value = sum(
        item.Price * item.StockQuantity 
        for item in items.filter(
            StockQuantity__gt=0, 
            StockQuantity__lte=models.F('LowStockThreshold')
        )
    )
    
    normal_stock_value = sum(
        item.Price * item.StockQuantity 
        for item in items.filter(
            StockQuantity__gt=models.F('LowStockThreshold')
        )
    )
    
    # カテゴリ別の価値を計算
    categories = Category.objects.all()
    category_values = []
    
    for category in categories:
        cat_items = items.filter(Category=category.CategoryId)
        category_value = sum(item.Price * item.StockQuantity for item in cat_items)
        
        if category_value > 0:
            category_values.append({
                'id': category.CategoryId,
                'name': category.CategoryName,
                'value': float(category_value),
                'percentage': float(category_value / total_stock_value * 100) if total_stock_value > 0 else 0
            })
    
    # 価値が高い順にソート
    category_values.sort(key=lambda x: x['value'], reverse=True)
    
    # Top 10の高価値商品
    top_value_items = [{
        'id': item.ItemId,
        'name': item.ItemName,
        'value': float(item.Price * item.StockQuantity),
        'quantity': item.StockQuantity,
        'price': float(item.Price)
    } for item in sorted(
        items.filter(StockQuantity__gt=0), 
        key=lambda x: x.Price * x.StockQuantity,
        reverse=True
    )[:10]]
    
    return Response({
        'total_stock_value': float(total_stock_value),
        'stock_value_by_status': {
            'out_of_stock': float(out_of_stock_value),
            'low_stock': float(low_stock_value),
            'normal_stock': float(normal_stock_value)
        },
        'category_values': category_values,
        'top_value_items': top_value_items
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_statistics(request):
    """在庫統計情報 - 在庫に関する様々な統計指標"""
    items = Items.objects.all()
    total_items = items.count()
    
    if total_items == 0:
        return Response({
            'message': '商品がありません。',
            'total_items': 0
        })
    
    # 基本統計
    total_stock = sum(item.StockQuantity for item in items)
    avg_stock = total_stock / total_items
    
    # 価格統計
    prices = [item.Price for item in items]
    avg_price = sum(prices) / len(prices)
    max_price = max(prices) if prices else 0
    min_price = min(prices) if prices else 0
    
    # 在庫状態別の数
    out_of_stock = items.filter(StockQuantity=0).count()
    low_stock = items.filter(StockQuantity__gt=0, StockQuantity__lte=models.F('LowStockThreshold')).count()
    normal_stock = items.filter(StockQuantity__gt=models.F('LowStockThreshold')).count()
    
    # 閾値を大きく下回っている商品（要発注）
    critical_low = items.filter(
        StockQuantity__gt=0,
        StockQuantity__lte=models.F('LowStockThreshold') * 0.5
    ).count()
    
    # 閾値を大きく上回っている商品（過剰在庫の可能性）
    excess_stock = items.filter(
        StockQuantity__gt=models.F('LowStockThreshold') * 3
    ).count()
    
    return Response({
        'total_items': total_items,
        'total_stock_quantity': total_stock,
        'average_stock_per_item': float(avg_stock),
        'price_statistics': {
            'average_price': float(avg_price),
            'max_price': float(max_price),
            'min_price': float(min_price)
        },
        'stock_status': {
            'out_of_stock': out_of_stock,
            'out_of_stock_percentage': float(out_of_stock / total_items * 100),
            'low_stock': low_stock,
            'low_stock_percentage': float(low_stock / total_items * 100),
            'normal_stock': normal_stock,
            'normal_stock_percentage': float(normal_stock / total_items * 100)
        },
        'inventory_alerts': {
            'critical_low_stock': critical_low,
            'excess_stock': excess_stock
        }
    })

# File upload endpoint with JWT authentication
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def SaveFile(request):
    file = request.FILES['file']
    file_name = default_storage.save(file.name, file)
    return Response(file_name)
