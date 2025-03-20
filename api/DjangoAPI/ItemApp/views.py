from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from ItemApp.models import Companys, Items, User, Category
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
        companys_serializer = CompanySerializer(data=request.data)
        if companys_serializer.is_valid():
            companys_serializer.save()
            return Response({"message": "正常に追加されました！"}, status=status.HTTP_201_CREATED)
        return Response(companys_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            company = Companys.objects.get(CompanyId=request.data['CompanyId'])
        except Companys.DoesNotExist:
            return Response({"message": "会社が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
        
        companys_serializer = CompanySerializer(company, data=request.data)
        if companys_serializer.is_valid():
            companys_serializer.save()
            return Response({"message": "正常に更新されました！"})
        return Response(companys_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
        items_serializer = ItemSerializer(data=request.data)
        if items_serializer.is_valid():
            items_serializer.save()
            return Response({"message": "正常に追加されました！"}, status=status.HTTP_201_CREATED)
        return Response(items_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            item = Items.objects.get(ItemId=request.data['ItemId'])
        except Items.DoesNotExist:
            return Response({"message": "商品が見つかりません"}, status=status.HTTP_404_NOT_FOUND)
        
        items_serializer = ItemSerializer(item, data=request.data)
        if items_serializer.is_valid():
            items_serializer.save()
            return Response({"message": "正常に更新されました！"})
        return Response(items_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
        category_serializer = CategorySerializer(data=request.data)
        if category_serializer.is_valid():
            category_serializer.save()
            return Response({"message": "カテゴリが正常に追加されました！"}, status=status.HTTP_201_CREATED)
        return Response(category_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        try:
            category = Category.objects.get(CategoryId=request.data['CategoryId'])
        except Category.DoesNotExist:
            return Response({"message": "カテゴリが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
        
        category_serializer = CategorySerializer(category, data=request.data)
        if category_serializer.is_valid():
            category_serializer.save()
            return Response({"message": "カテゴリが正常に更新されました！"})
        return Response(category_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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

# File upload endpoint with JWT authentication
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def SaveFile(request):
    file = request.FILES['file']
    file_name = default_storage.save(file.name, file)
    return Response(file_name)
