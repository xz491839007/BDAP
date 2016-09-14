# coding:utf-8

import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout

def home(request):
    user = request.user
    if user.is_active:
        return render(request,'taglist.html')
    return render(request, 'login.html')

def login_views(request):
    data = json.loads(request.body)
    username = data["username"]
    password = data["password"]
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            data['success'] = True
            return JsonResponse(data)
        else:
            pass
    else:
        data["success"] = False
        return JsonResponse(data)

def logout_views(request):
    logout(request)
    return render(request, "login.html")
