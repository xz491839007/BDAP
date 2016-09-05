# coding:utf-8

import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

from usertag.views import taglist

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
