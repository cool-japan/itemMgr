from rest_framework import serializers
from ItemApp.models import Companys,Items

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model=Companys 
        fields=('CompanyId','CompanyName')

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=Items 
        fields=('ItemId','ItemName','Company','DateOfJoining','Abstract','Price','PhotoFileName')
