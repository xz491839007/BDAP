# coding: utf-8
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from models import Dbs, Tbls, ColumnLabel
import json
import pyhs2

@login_required()
def taglist(request):
    return render(request, 'tagList.html')

@login_required()
def rulelist(request):
    return render(request, 'rulelist.html')

@login_required()
def addtag(request):
    return render(request, 'tagAdd.html')

@login_required()
def addrule(request):
    return render(request, "addRule.html")

@login_required()
def showall(request):
    result = {}
    result["success"] = True
    dbs = [[item.db_id, item.name] for item in Dbs.objects.using("hive").all()]
    result["data"] = []
    for db in dbs:
        db_info = {}
        db_info["id"] = db[0]
        db_info["name"] = db[1]
        result["data"].append(db_info)
    return JsonResponse(result)

@login_required()
def tablelist(request):
    result = {}
    db_id = request.GET.get("dbid")
    list = [item.tbl_name for item in Tbls.objects.using("hive").filter(db_id=db_id).all()]
    result["success"] = True
    result["data"] = list
    return JsonResponse(result)

@login_required()
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

@login_required()
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
    print tagname
    if len(ColumnLabel.objects.using("test").filter(name=tagname).all()) == 0:
        req["success"] = True
        ColumnLabel.objects.using("test").get_or_create(db_name=dbname,name=tagname,type=tagtype,
                      note=note,table_name=tablename,classification=tagclass,
                      column_name=columnname,join_column_name=usercolum)
        return JsonResponse(req)
    else:
        req["success"] = False
        req["message"] = "该标签名已存在"
        return JsonResponse(req)

@login_required()
def labellist(request):
    labellist = {}
    labellist["success"] = True
    labellist["data"] = []
    label = ColumnLabel.objects.using("test").all()
    for item in label:
        sonlabel = {}
        sonlabel["tagname"] = item.name
        sonlabel["classification"] = item.classification
        sonlabel["joinColumnName"] = item.join_column_name
        sonlabel["createtime"] = item.create_time
        sonlabel["note"] = item.note
        labellist["data"].append(sonlabel)
    return JsonResponse(labellist)

@login_required()
def delete(request):
    req = json.loads(request.body)
    req["success"] = True
    tagname = req["name"]
    ColumnLabel.objects.using("test").filter(name=tagname).delete()
    return JsonResponse(req)

