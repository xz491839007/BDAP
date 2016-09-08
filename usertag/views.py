from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from models import Dbs,Tbls
from hive_service import ThriftHive
from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
import json



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
    db_id = request.GET.get("dbname")
    list = [item.tbl_name for item in Tbls.objects.using("hive").filter(db_id=db_id).all()]
    # try:
    #     transport = TSocket.TSocket("127.0.0.1", 10000)
    #     transport = TTransport.TBufferedTransport(transport)
    #     prtocol = TBinaryProtocol.TBinaryProtocol(transport)
    #     client = ThriftHive.Client(prtocol)
    #     transport.open()
    #     db = "bigdata"
    #     table = "users"
    #     sql = "DESC %s.%s" %(dbname,table)
    #     client.execute(sql)
    #
    #     print "The return value is:"
    #     tables = [item.split("\t")[0].strip() for item in client.fetchAll()]
        # print tables
        # transport.close()
    #
    # except Thrift.TException, tx:
    #     print '%s' %(tx.message)

    result["success"] = True
    result["data"] = list

    return JsonResponse(result)

def columnlist(request):
    result = {}
    db_id = request.GET.get("dbname")
    tablename = request.GET.get("tablename")
    result["success"] = True
    result["data"] = ["c1", "c2", "c3", "c4"]
    return JsonResponse(result)

@require_http_methods(["POST"])
def createtag(request):
    req = json.loads(request.body)
    print req
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

