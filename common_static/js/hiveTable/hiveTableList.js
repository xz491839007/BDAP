require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    /**
     * Created by user on 16/6/20.
     */
    var hiveTableList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        hdb:"",

        pid:"",

        init:function(){
            var _this = this;
            this.initEvent();
            //this.getLeftKu();
            this.hdb = $.getQueryString("hdb");
            this.pid = $.getQueryString("pid");
            this._getLeftKu();
            if(this.pid == null){
                this.pid = -1;
            }

            $("#createName").quickSearch({
                data: staff,
                text: "loginName",
                value: "loginName",
                width: "400px"
            });
            $("#createName").changeValue(function () {
                _this.pageNo = 1;
                _this.getHiveList();
            });

        },

        initEvent:function(){
            var _this = this;
            $("#addHiveTable").click(function(){
                var isEdw = $("#leftKu").find("i.text-light-blue").parent().text().endWith("_ods");
                $("#hiveIn").trigger("click");
                if(!isEdw){
                    $("#hiveOut").prop("disabled","true");
                    $("#tipEdw").show();
                }else{
                    $("#hiveOut").removeAttr("disabled");
                    $("#tipEdw").hide();
                }
                $("#chooseTypeModal").modal("toggle");
            });
            $("#sureAddHive").click(function(){
                var id = $("#leftKu").find("i.text-light-blue").parent().attr("data-id");

                var selectRadio = $("input[name='hivetype']:checked").val();
                if(selectRadio == 1){
                    location.href = 'hiveTableAdd.html?pid='+_this.pid+'&hdb='+id;
                }else{
                    location.href = 'hiveOutTableAdd.html?pid='+_this.pid+'&hdb='+id;
                }



            });
            $('#createTime,#modifyTime').datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                todayHighlight: true,
                showMeridian: true,
                minView:2,
                pickerPosition: "bottom-right",
                language: "zh-CN"
            });

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getHiveList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getHiveList();
            });

            $("#leftKu").delegate('a','click',function(){
                $("#leftKu .fa-tablet").removeClass("text-light-blue");
                $(this).find(".fa-tablet").addClass("text-light-blue");
                _this.pageNo = 1;
                _this.pid = $(this).parent().parent().attr("data-pid");
                _this.hdb = $(this).attr("data-id");
                //查询右侧列表
                _this.getHiveList($(this).attr("data-id"));
            });

            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    if(e.target.id == "createName" && e.target.value != ""){
                        return;
                    }
                    _this.pageNo = 1;
                    _this.getHiveList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getHiveList();
            });

            $("#hiveTableList").delegate(".fa-cog","click",function(){
                var hiveType = $(this).parent().attr("data-hiveType");
                var id = $("#leftKu").find("i.text-light-blue").parent().attr("data-id");
                if(hiveType == "MANAGED_TABLE"){
                    location.href = 'hiveTableModify.html?pid='+_this.pid+'&hdb='+id+'&tableId='+$(this).parent().attr("data-id");
                }else{
                    location.href = 'hiveOutTableModify.html?pid='+_this.pid+'&hdb='+id+'&tableId='+$(this).parent().attr("data-id");
                }

            });
            $("#hiveTableList").delegate(".fa-times","click",function(){
                if(confirm("是否要删除该表么?")){
                    _this.deleteTable($(this).parent().attr("data-id"),$(this).parent().attr("data-dbName"),$(this).parent().attr("data-name"));
                }
            });

            $("#hiveTableList").delegate(".fa-eye","click",function(){
                var id = $("#leftKu").find("i.text-light-blue").parent().attr("data-id");
                window.open ('hiveTableInfo.html?hdb='+id+'&tableId='+$(this).parent().attr("data-id"));
            });

            $("#leftKu").delegate(".btn-box-tool","click",function(){
                var _t = $(this);

                if(_t.attr("data-flag")=="false"){
                    _t.attr("data-flag","true");
                    if(_t.parent().parent().attr("data-pid") == "-1"){
                        _this.getCangku(_t);
                    }else{
                        _this.getChildren(_t.attr("data-id"),_t);
                    }
                }
            });
        },

        deleteTable:function(id,dbName,name){
            var _this = this;
            var hBusinessTable ={
                tabId:id,
                tabName:name,
                databaseName:dbName
            };
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/hiveManage/dropTable",
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(hBusinessTable),
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("删除成功.");
                        _this.getHiveList();
                    }else{
                        $.showModal({content:"删除失败"+result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getHiveList:function(firstMenuId){
            if(!firstMenuId){
                firstMenuId = $("#leftKu .text-light-blue").parent().attr("data-id");
            }
            var _this = this;
            var tableName = $("#tableName").val();
            var cname = $("#cname").val();
            var createName = $("#createName").val();
            var createTime = $("#createTime").val();
            var modifyTime = $("#modifyTime").val();
            var tableType = $("#tableType").val();
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/table/list",
                data: {
                    dbId:firstMenuId,
                    name: tableName,
                    chineseName: cname,
                    creator:createName,
                    hiveType:tableType,
                    createTimeFormat:createTime,
                    timestampFormat:modifyTime,
                    pageNo:_this.pageNo,
                    pageSize:_this.pageSize
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        _this.setDataList(dat);
                    }else{
                        $.showModal({content:"查询失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setDataList:function(dat){
            this.totalPage = dat.totalPage;
            this.totalRecords = dat.totalRecords;
            $("#currentPageNum").html(this.pageNo);
            $("#totalPageNum").html(this.totalPage);
            $("#totalNum").html(this.totalRecords);
            var data = dat.results;
            var strHtml = "";
            for(var i=0;i<data.length;i++){
                var opeFa = '<i class="fa fa-fw fa-cog pull-left myfabut"></i>'
                    +'<i class="fa fa-fw fa-times pull-left myfabut"></i>';
                var sHtml = '<tr>'
                    +'<td title="'+data[i].name+'">'+data[i].name+'</td>'
                    +'<td title="'+data[i].chineseName+'">'+data[i].chineseName+'</td>'
                    +'<td title="'+data[i].creator+'">'+data[i].creator+'</td>'
                    +'<td>'+(data[i].hiveType=="MANAGED_TABLE"?"内表":"外表")+'</td>'
                    +'<td>'+(new Date(data[i].createTime)).Format("yyyy-MM-dd")+'</td>'
                    +'<td>'+(new Date(data[i].timestamp)).Format("yyyy-MM-dd")+'</td>'
                    +'<td data-id="'+data[i].id+'" data-hiveType="'+data[i].hiveType+'" data-dbName="'+data[i].dbName+'" data-name="'+data[i].name+'" style="width:120px;">'
                    + opeFa
                    +'<i class="fa fa-fw fa-eye pull-left myfabut"></i>'
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#hiveTableList").html(strHtml);
        },

        getCangku:function(_t){
            var _this = this;
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/inner/hives",
                data: {
                },
                success: function (result) {
                    if (result && result.success) {
                        var innerHiveDBs = result.pairs.innerHiveDBs;
                        _this.setChildren(innerHiveDBs,_t);
                    } else {
                        $.showModal({content: result.message});
                    }
                },
                error: function (a, b, c) {
                    alert(a.responseText);
                }
            });
        },

        _getLeftKu:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/market/list",
                data: {
                    name:"",
                    note:"",
                    pageNo:1,
                    pageSize:1000,
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat,results = dat.results;
                        for(var i=0;i<results.length;i++){
                            var sHtml = '<div class="box box-solid collapsed-box" data-pid="'+results[i].id+'">'
                                +'<div class="box-header with-border">'
                                +'<h3 class="box-title">'+results[i].name+'集市</h3>'
                                +'<div class="box-tools">'
                                +'<button class="btn btn-box-tool" data-id="'+results[i].id+'" data-flag="false" data-widget="collapse"><i class="fa fa-plus"></i></button>'
                                +'</div>'
                                +'</div>'
                                +'<div class="box-body no-padding" style="disaplay: none;">'
                                +'<ul class="nav nav-pills nav-stacked" data-pid="'+results[i].id+'">'
                                +'</ul>'
                                +'</div>'
                                +'</div>';
                            $("#leftKu").append(sHtml);
                        }
                        $("#leftKu").find(".btn-box-tool[data-id="+_this.pid+"]").trigger("click");
                    }else{
                        $.showModal({content:"获取菜单失败,请刷新重试"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getChildren:function(id,_t){
            var _this = this;
            $.ajax({
                type: "get",
                url: "/sentosa/market/db/list",
                data: {
                    marketId: id
                },
                success: function (result) {
                    debugger;
                    if (result && result.success) {
                        _this.setChildren(result.pairs.dat,_t);
                    } else {
                        $.showModal({content: result.message});
                    }
                },
                error: function (a, b, c) {
                    alert(a.responseText);
                }
            });
        },
        setChildren:function(data,_t){
            var tbody = _t.parent().parent().next().find(".nav-pills");
            for(var i=0;i<data.length;i++){
                if(this.pid == -1 && this.hdb == null && i == 0){
                    this.hdb = data[i].id;
                }
                var str = '<li><a href="javascript:void(0);" data-id="'+data[i].id+'"><i class="fa fa-tablet '+((this.hdb == data[i].id)?"text-light-blue":"")+'"></i>'+data[i].name+'</a></li>';
                tbody.append(str);
            }
            this.getHiveList(this.hdb);
        },

        getLeftKu:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/hives",
                data: {
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var pairs = result.pairs;
                        var strHtml = "";
                        var k =0;
                        for(var r in pairs){
                            var secondElms = pairs[r];
                            if(r == "innerHiveDBs"){
                                r =  "仓库";
                            }else{
                                r = "集市";
                            }
                            var sHtml = '<div class="box box-solid">'
                                +'<div class="box-header with-border">'
                                +'<h3 class="box-title">'+r+'</h3>'
                                +'<div class="box-tools">'
                                +'<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'
                                +'</div>'
                                +'</div>'
                                +'<div class="box-body no-padding" style="disaplay: block;">'
                                +'<ul class="nav nav-pills nav-stacked">';
                            for(var i=0;i<secondElms.length;i++){
                                if(_this.hdb == null && k ==0 && i == 0){
                                    _this.hdb = secondElms[i].id;
                                }
                                if(secondElms[i].name.indexOf("temp")>-1 || secondElms[i].name.indexOf("merge")>-1){
                                    continue;
                                }
                                sHtml = sHtml + '<li><a href="javascript:void(0);" data-id="'+secondElms[i].id+'"><i class="fa fa-tablet '+((_this.hdb == secondElms[i].id)?"text-light-blue":"")+'"></i>'+secondElms[i].name+'</a></li>'
                            }
                            sHtml = sHtml + '</ul>'
                                +'</div>'
                                +'</div>';
                            strHtml = strHtml + sHtml;
                            k ++;
                        }
                        $("#leftKu").html(strHtml);
                        _this.getHiveList(_this.hdb);
                    }else{
                        $.showModal({content:"获取菜单失败,请刷新重试"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        }

    }
    hiveTableList.init();
});