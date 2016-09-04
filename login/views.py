# coding:utf-8

import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from login.models import User
from usertag.views import taglist

def index(request):
    return render(request, 'login.html')

def usertag(request):
    # a = request.GET['a']
    # b = request.GET['b']
    # c = int(a) + int(b)
    return taglist(request)

def home(request):
        return render(request, 'login.html')

def login(request):
    data = json.loads(request.body)
    username = data["userName"]
    password = data["password"]
    data['success'] = "true"
    return JsonResponse(data)

def query(request):
    # a = User(id = 10, username='wq', password="123456")
    # a.save()
    b = User.objects.all()[1]
    print b.username
    return JsonResponse("success")

# Django如何处理GET和POST请求

@require_http_methods(["POST"])
def postmanage(request):
    req = json.loads(request.body)
    print req
    print req["name"]
