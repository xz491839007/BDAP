from django.shortcuts import render
from django.http import JsonResponse

from django.views.decorators.http import require_http_methods
from models import Dbs, Tbls, ColumnLabel
from login.models import User
import json
import pyhs2

def taglist(request):
    return render(request, 'tagList.html')

def rulelist(request):
    return render(request, 'rulelist.html')

def addtag(request):
    return render(request, 'tagAdd.html')

def addrule(request):
    return render(request, "addRule.html")

def showall(request):
    result = {}
    result["success"] = True
    dbs = [[item.db_id, item.name] for item in Dbs.objects.using("hive").all()]
    # dbname = [item.name for item in Dbs.objects.using("hive").all()]
    result["data"] = []
    # result["data"]["dbs"] = {}
    for db in dbs:
        db_info = {}
        db_info["id"] = db[0]
        db_info["name"] = db[1]
        result["data"].append(db_info)
    return JsonResponse(result)

def tablelist(request):
    result = {}
    db_id = request.GET.get("dbid")
    list = [item.tbl_name for item in Tbls.objects.using("hive").filter(db_id=db_id).all()]
    result["success"] = True
    result["data"] = list
    return JsonResponse(result)

def columnlist(request):
    result = {}
    tablename = request.GET.get("tableName")
    alias = request.GET.get("alias")
    if tablename is not None and alias is not None:
        with pyhs2.connect(host='127.0.0.1',
                       port=10000,
                       authMechanism="NOSASL",
                       database=alias) as conn:
            with conn.cursor() as cur:
                hql = "DESC %s.%s" %(alias, tablename)
                cur.execute(hql)
                labels = [item[0] for item in cur.fetch()]

        result["success"] = True
        result["data"] = labels
        return JsonResponse(result)
    else:
        result["success"] = False
        return JsonResponse(result)

def createtag(request):
    req = json.loads(request.body)
    dbname = req["dbname"]
    tagname = req["tagname"]
    tablename = req["tableName"]
    tagtype = req["tagType"]
    columnname = req["columnName"]
    usercolum = req["userColum"]
    tagclass = req["tagclass"]
    note = req["note"]
    # print req
    ColumnLabel.objects.using("test").get_or_create(db_name=dbname,name=tagname,type=tagtype,
                      note=note,table_name=tablename,classification=tagclass,
                      column_name=columnname,join_column_name=usercolum)
    # print ColumnLabel.objects.using("test").all()
    return JsonResponse(req)

def labellist(request):
    data = {}
    data["success"] = True
    result = []
    data1 = {}
    data1["name"] = "pengshuang"
    data1["desc"] = "creative!"
    data1["type"] = 1
    # data1["id"] = 2
    data1["joinColumnName"] = "age"
    data1["createDate"] = "2012-12-12 10:00:00"
    data1["note"] = "ok"
    result.append(data1)
    data["result"] = result
    return JsonResponse(data)

def labelget(request):
    return JsonResponse(None)

