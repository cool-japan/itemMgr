from rest_framework import serializers
from ItemApp.models import Companys, Items, Category
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "パスワードが一致しません"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "username"
    
    def validate(self, attrs):
        print("認証試行:", attrs)
        try:
            data = super().validate(attrs)
            print("認証成功:", self.user)
            return data
        except Exception as e:
            print("認証エラー:", str(e))
            raise
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # カスタムクレームを追加
        token['username'] = user.username
        token['email'] = user.email
        return token

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Companys 
        fields = ('CompanyId', 'CompanyName')
        
    def validate_CompanyName(self, value):
        """会社名フィールドの検証"""
        if not value or value.strip() == '':
            raise serializers.ValidationError("会社名は必須項目です。")
        return value

class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('CategoryId', 'CategoryName', 'Description', 'ParentCategory', 'parent_name')
    
    def get_parent_name(self, obj):
        if obj.ParentCategory:
            return obj.ParentCategory.CategoryName
        return None
        
    def validate_CategoryName(self, value):
        """カテゴリ名フィールドの検証"""
        if not value or value.strip() == '':
            raise serializers.ValidationError("カテゴリ名は必須項目です。")
        return value

class CategoryDetailSerializer(serializers.ModelSerializer):
    subcategories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ('CategoryId', 'CategoryName', 'Description', 'ParentCategory', 'subcategories')

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    stock_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Items 
        fields = ('ItemId', 'ItemName', 'Company', 'Category', 'category_name', 'DateOfJoining', 
                 'Abstract', 'Price', 'PhotoFileName', 'StockQuantity', 'LowStockThreshold', 'stock_status')
    
    def get_category_name(self, obj):
        if obj.Category:
            return obj.Category.CategoryName
        return None
        
    def get_stock_status(self, obj):
        return obj.stock_status
        
    def validate_Abstract(self, value):
        """概要フィールドの検証"""
        if not value or value.strip() == '':
            raise serializers.ValidationError("概要は必須項目です。商品の説明を入力してください。")
        return value
        
    def validate_ItemName(self, value):
        """商品名フィールドの検証"""
        if not value or value.strip() == '':
            raise serializers.ValidationError("商品名は必須項目です。")
        return value
        
    def validate_Price(self, value):
        """価格フィールドの検証"""
        if value is None:
            raise serializers.ValidationError("価格は必須項目です。")
        if value <= 0:
            raise serializers.ValidationError("価格は0より大きい値を入力してください。")
        return value
        
    def validate_StockQuantity(self, value):
        """在庫数フィールドの検証"""
        if value is None:
            raise serializers.ValidationError("在庫数は必須項目です。")
        if value < 0:
            raise serializers.ValidationError("在庫数は0以上の値を入力してください。")
        return value
        
    def validate_LowStockThreshold(self, value):
        """在庫僅少閾値フィールドの検証"""
        if value is None:
            raise serializers.ValidationError("在庫僅少閾値は必須項目です。")
        if value < 1:
            raise serializers.ValidationError("在庫僅少閾値は1以上の値を入力してください。")
        return value
