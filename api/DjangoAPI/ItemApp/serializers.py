from rest_framework import serializers
from ItemApp.models import Companys, Items, User, Category
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "パスワードが一致しません"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
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

class CategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ('CategoryId', 'CategoryName', 'Description', 'ParentCategory', 'parent_name')
    
    def get_parent_name(self, obj):
        if obj.ParentCategory:
            return obj.ParentCategory.CategoryName
        return None

class CategoryDetailSerializer(serializers.ModelSerializer):
    subcategories = CategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ('CategoryId', 'CategoryName', 'Description', 'ParentCategory', 'subcategories')

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Items 
        fields = ('ItemId', 'ItemName', 'Company', 'Category', 'category_name', 'DateOfJoining', 
                 'Abstract', 'Price', 'PhotoFileName')
    
    def get_category_name(self, obj):
        if obj.Category:
            return obj.Category.CategoryName
        return None
