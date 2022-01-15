from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from ItemApp.models import Companys,Items
from ItemApp.serializers import CompanySerializer,ItemSerializer

from django.core.files.storage import default_storage

# Create your views here.

@csrf_exempt
def companyApi(request,id=0):
    if request.method=='GET':
        companys = Companys.objects.all()
        companys_serializer=CompanySerializer(companys,many=True)
        return JsonResponse(companys_serializer.data,safe=False)
    elif request.method=='POST':
        company_data=JSONParser().parse(request)
        companys_serializer=CompanySerializer(data=company_data)
        if companys_serializer.is_valid():
            companys_serializer.save()
            return JsonResponse("正常に追加されました！",safe=False)
        return JsonResponse("追加に失敗！",safe=False)
    elif request.method=='PUT':
        company_data=JSONParser().parse(request)
        company=Companys.objects.get(CompanyId=company_data['CompanyId'])
        companys_serializer=CompanySerializer(company,data=company_data)
        if companys_serializer.is_valid():
            companys_serializer.save()
            return JsonResponse("正常に更新されました！",safe=False)
        return JsonResponse("更新に失敗！")
    elif request.method=='DELETE':
        company=Companys.objects.get(CompanyId=id)
        company.delete()
        return JsonResponse("正常に削除されました！",safe=False)

@csrf_exempt
def itemApi(request,id=0):
    if request.method=='GET':
        items = Items.objects.all()
        items_serializer=ItemSerializer(items,many=True)
        return JsonResponse(items_serializer.data,safe=False)
    elif request.method=='POST':
        item_data=JSONParser().parse(request)
        items_serializer=ItemSerializer(data=item_data)
        if items_serializer.is_valid():
            items_serializer.save()
            return JsonResponse("正常に追加されました！",safe=False)
        return JsonResponse("追加に失敗！",safe=False)
    elif request.method=='PUT':
        item_data=JSONParser().parse(request)
        item=Items.objects.get(ItemId=item_data['ItemId'])
        items_serializer=ItemSerializer(item,data=item_data)
        if items_serializer.is_valid():
            items_serializer.save()
            return JsonResponse("正常に更新されました！",safe=False)
        return JsonResponse("更新に失敗！")
    elif request.method=='DELETE':
        item=Items.objects.get(ItemId=id)
        item.delete()
        return JsonResponse("正常に削除されました！",safe=False)

@csrf_exempt
def SaveFile(request):
    file=request.FILES['file']
    file_name=default_storage.save(file.name,file)
    return JsonResponse(file_name,safe=False)
