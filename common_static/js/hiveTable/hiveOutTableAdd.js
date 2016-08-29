/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var hiveOutTableAdd = {

        hdb:"",

        pid:"",

        init: function () {
            this.initEvent();
            //this.getLeftKu();
            this.hdb = $.getQueryString("hdb");
            this.pid = $.getQueryString("pid");
            this._getLeftKu();
        },

        initEvent: function () {
            var _this = this;
            $(".myoprfa .fa").click(function () {
                var type = $(this).attr("data-type");
                var selectRadio = $("input[name='optionsRadios']:checked");
                if (selectRadio.length == 0 && type != "add") {
                    $.showModal({
                        content: "请先在选择一个字段",
                        title: "提示信息"
                    });
                    return;
                }

                var $tr = selectRadio.parents("tr");
                if (type == "add") {
                    var strHtml = '<tr>'
                        + '<td>'
                        + '<div class="radio">'
                        + '<label>'
                        + '<input type="radio" name="optionsRadios" value="1">'
                        + '</label>'
                        + '</div>'
                        + '</td>'
                        + '<td>'
                        + '<div class="input-group-sm">'
                        + '<input type="text" class="form-control" placeholder="">'
                        + '</div>'
                        + '</td>'
                        + '<td>'
                        + _this.setSelectStr("-1")
                        + '</td>'
                        + '<td>'
                        + _this.setDecimalStr("-1")
                        + '</td>'
                        + ' <td>'
                        + '<div class="input-group-sm">'
                        + '<input type="text" class="form-control" placeholder="">'
                        + '</div>'
                        + '</td>'
                        + '</tr>';
                    if (selectRadio.length == 0) {
                        $("#hiveZiduan").append(strHtml);
                    } else {
                        $tr.after(strHtml);
                    }
                    $("#hiveZiduan .jingduinput").numeral();

                } else if (type == "del") {
                    $tr.remove();
                } else if (type == "up") {
                    if ($tr.index() != 0) {
                        $tr.prev().before($tr);
                    }
                } else if (type == "down") {
                    var $tr = $(selectRadio).parents("tr");
                    if ($tr.next().length > 0) {
                        $tr.next().after($tr);
                    }
                }
            });

            $(".myoprfafenqu .fa").click(function () {
                var type = $(this).attr("data-type");
                var selectRadio = $("input[name='fenquziduans']:checked");
                if (selectRadio.length == 0 && type != "add") {
                    $.showModal({
                        content: "请先在选择一个字段",
                        title: "提示信息"
                    });
                    return;
                }

                var $tr = selectRadio.parents("tr");
                if (type == "add") {
                    var strHtml = '<tr>'
                        + '<td>'
                        + '<div class="radio">'
                        + '<label>'
                        + '<input type="radio" name="fenquziduans" value="1">'
                        + '</label>'
                        + '</div>'
                        + '</td>'
                        + '<td>'
                        + '<div class="input-group-sm">'
                        + '<input type="text" class="form-control" value="" placeholder="">'
                        + '</div>'
                        + '</td>'
                        + '<td>'
                        + '<select>'
                        + '<option value="STRING" SELECTED>STRING</option>'
                        + '</select>'
                        + '</td>'
                        + '<td>'
                        + '<div class="input-group-sm">'
                        + '<input type="text" class="form-control" value="" placeholder="">'
                        + '</div>'
                        + '</td>'
                        + '</tr>';
                    if (selectRadio.length == 0) {
                        $("#hiveFenquZiduan").append(strHtml);
                    } else {
                        $tr.after(strHtml);
                    }
                } else if (type == "del") {
                    $tr.remove();
                }
            });

            $("#leftKu").delegate('a', 'click', function () {
                $("#leftKu .fa-tablet").removeClass("text-light-blue");
                $(this).find(".fa-tablet").addClass("text-light-blue");
                //查询右侧列表
                location.href = "hiveTableList.html?pid="+$(this).parent().parent().attr("data-pid")+"&hdb=" + $(this).attr("data-id");
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

            $(".isyilai").click(function () {
                var selectRadio = $("input[name='isyilai']:checked").val();
                if (selectRadio == 1) {
                    $(".yuankuinfo").show();
                    $(".locationdiv").hide();
                    $("#sTable").val("");
                    $("#hiveZiduan").html("");
                } else {
                    $(".yuankuinfo").hide();
                    $(".locationdiv").show();
                    $("#location").val("");
                }
            });

            $("#hiveZiduan").delegate(".leixing","change",function(){
                var value = $(this).val();
                if(value == "DECIMAL"){
                    $(this).parent().next().find(".jingduinput").css("visibility","visible");
                }else{
                    $(this).parent().next().find(".jingduinput").css("visibility","hidden");
                }
            });

            $("#hiveZiduan").delegate(".jingduinput","blur",function(){
                if($(this).val() == ""){
                    $(this).val($(this).attr("data-value"));
                }
            });

            $("#saveTable").click(function(){
                _this.checkElm("save");
            });

            $("#yulan").click(function(){
                _this.checkElm("yulan");
            });

            $("#tabName").blur(function(){
                var value = $(this).val();
                _this.checkName(value);
            });

            //指标搜索
            $("#zhibiaosearchbut").click(function(){
                var value = $("#searchZhibiao").val();
                _this.searchZhibiao($.trim(value));
            });
            $("#searchValues").delegate("tr","click",function(){
                _this.setSelectElm(this);
            });
            $(".zhibiaofa .fa").click(function () {
                var type = $(this).attr("data-type");
                var selectRadio = $("input[name='zhibiaoRadios']:checked");
                if (selectRadio.length == 0) {
                    $.showModal({
                        content: "请先在选择一个字段",
                        title: "提示信息"
                    });
                    return;
                }

                var $tr = selectRadio.parents("tr");
                if (type == "del") {
                    $tr.remove();
                } else if (type == "up") {
                    if ($tr.index() != 0) {
                        $tr.prev().before($tr);
                    }
                } else if (type == "down") {
                    var $tr = $(selectRadio).parents("tr");
                    if ($tr.next().length > 0) {
                        $tr.next().after($tr);
                    }
                }
            });
            $(window).scroll(function(){
                var scrollTop = window.pageYOffset  //用于FF
                    || document.documentElement.scrollTop
                    || document.body.scrollTop
                    || 0;
                var dingzhitabletop = getTop(document.getElementById('dingzhitable'))-scrollTop;
                var myoprfaLeft = getLeft(document.getElementById('myoprfa'));
                if(dingzhitabletop<=0){
                    $("#myoprfa").css({position:"fixed",top:"50",left:myoprfaLeft});
                }else{
                    $("#myoprfa").css({position:"relative",left:0,top:0});
                }
            });
            //获取元素的纵坐标（相对于窗口）
            function getTop(e){
                var offset=e.offsetTop;
                if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
                return offset;
            }
            //获取元素的横坐标（相对于窗口）
            function getLeft(e){
                var offset=e.offsetLeft;
                if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
                return offset;
            }
        },
        setSelectElm:function(obj){
            var name = $(obj).attr("data-name");
            var selectValues = $("#selectValues tr");
            var flag = true;
            for(var i=0;i<selectValues.length;i++){
                if(selectValues.eq(i).find("td").eq(1).html() == name){
                    flag = false;
                    return;
                }
            }
            if(flag){
                $("#selectValues").append('<tr>'
                    +'<td>'
                    + '<div class="radio">'
                    + '<label>'
                    + '<input type="radio" name="zhibiaoRadios" >'
                    + '</label>'
                    + '</div>'
                    + '</td>'+$(obj).html()+'</tr>');
            }

        },

        searchZhibiao:function(value){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/quota/list",
                data: {
                    name:value,
                    chineseName:"",
                    creator:"",
                    pageNo:1,
                    pageSize:10000
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
            var data = dat.results;
            var strHtml = "";
            for(var i=0;i<data.length;i++){
                var sHtml = '<tr data-name="'+data[i].name+'">'
                    +''
                    +'<td>'+data[i].name+'</td>'
                    +'<td>'+data[i].columnType+'</td>'
                    +'<td>'+data[i].note+'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#searchValues").html(strHtml);
        },

        checkName:function(value){
            var _this  = this;
            if($.trim(value)==""){
                return;
            }
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/table/exists",
                data: {
                    name:value,
                    dbId:_this.hdb
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        if(!dat){
                            $("#cnameError").show();
                        }else{
                            $("#cnameError").hide();
                        }
                    }else{
                        $.showModal({content:result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        checkElm:function(type){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"tabName",label:"表名: 英文名"},
                    {name:"tabDescribe",label:"表名: 中文名"},
                    {name:"tabRemark",label:"表名: 备注"}
                ]
            );

            if($("#enameError").css("display") != "none"){
                return;
            }

            if(verifyFlag) {
                var hBusinessTable = {};


                //location
                hBusinessTable.tabLocationUri = $.trim($("#location").val());

                //字段校验以及封装
                var ziduantrs = $("#hiveZiduan tr");
                if (ziduantrs.length <= 0) {
                    showTip("字段:最少有一个字段");
                    return;
                }
                var hColumns = [];
                for (var m = 0; m < ziduantrs.length; m++) {
                    var obj = {}, tr = ziduantrs.eq(m);
                    var columnId = tr.attr("data-id");
                    if (columnId == undefined) {
                        columnId = -100;
                    }
                    obj.columnId = columnId;
                    var inputs = tr.find("input[type=text]");
                    var select = tr.find("select");
                    obj.columnName = $.trim(inputs.eq(0).val());//字段名
                    if (obj.columnName == "") {
                        showTip("字段:第" + (m + 1) + "行字段名不能为空");
                        return;
                    }
                    if (select.val() == "DECIMAL") {
                        obj.columnType = select.val() + "(" + inputs.eq(1).val() + "," + inputs.eq(2).val() + ")";
                    } else {
                        obj.columnType = select.val();
                    }
                    obj.columnComment = $.trim(inputs.eq(3).val());//描述
                    if (obj.columnComment == "") {
                        showTip("字段:第" + (m + 1) + "行字段描述不能为空");
                        return;
                    }
                    for(var iii=0;iii<hColumns.length;iii++){
                        if($.trim(hColumns[iii].columnName) == $.trim(obj.columnName)){
                            showTip("字段:第"+(iii+1)+"行字段名和第"+(m+1)+"行字段名重复");
                            return;
                        }
                    }
                    hColumns.push(obj);
                }
                hBusinessTable.hColumns = hColumns;

                //分区字段
                var fenquziduantrs = $("#hiveFenquZiduan tr");
                var hPartitionKeys = [];
                for(var n=0;n<fenquziduantrs.length;n++){
                    var obj = {},tr = fenquziduantrs.eq(n);
                    var inputs = tr.find("input[type=text]");
                    obj.pKeyNAME = $.trim(inputs.eq(0).val());//字段名
                    if(obj.pKeyNAME == ""){
                        showTip("分区字段:字段名不能为空");
                        return;
                    }
                    obj.pKeyTYPE = tr.find("select").val();
                    obj.pKeyComment = $.trim(inputs.eq(1).val());//描述
                    if(obj.pKeyComment == ""){
                        showTip("分区字段:字段描述不能为空");
                        return;
                    }
                    for(var iii=0;iii<hBusinessTable.hColumns.length;iii++){
                        if($.trim(hBusinessTable.hColumns[iii].columnName) == $.trim(obj.pKeyNAME)){
                            showTip("字段:第"+(iii+1)+"行字段名和分区字段名不能重复");
                            return;
                        }
                    }
                    hPartitionKeys.push(obj);
                }
                hBusinessTable.hPartitionKeys = hPartitionKeys;

                hBusinessTable.tabName = $("#tabName").val();
                var firstTabName = hBusinessTable.tabName.substr(0,1);
                if(!((firstTabName>='a'&&firstTabName<='z')||(firstTabName>='A'&&firstTabName<='Z'))){
                    showTip("表名:英文名必须是字母开头");
                    return;
                }

                hBusinessTable.tabDescribe = $("#tabDescribe").val();
                hBusinessTable.countPeriod = $("#countPeriod").val();
                hBusinessTable.tabRemark = $("#tabRemark").val();


                hBusinessTable.delimitedField = $("#delimitedField").val();

                hBusinessTable.inputFormat = $("#inputFormat").val();
                hBusinessTable.tabType = "external";//内部表 key
                hBusinessTable.databaseName = $("#leftKu").find("i.text-light-blue").parent().text();
                hBusinessTable.databaseId = $("#leftKu").find("i.text-light-blue").parent().attr("data-id");
                if(type == "save"){
                    this.saveTableInfo(hBusinessTable);
                }else{
                    this.yulan(hBusinessTable);
                }
            }

        },

        yulan:function(hBusinessTable){
            showloading(true);
            $.ajax({
                type: "POST",
                url: "/sentosa/hiveManage/createTablePreview",
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(hBusinessTable),
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var sql = result.pairs.sql;
                        $("#sqlYulan").val(sql);
                    } else {
                        $.showModal({content: result.message});
                        $("#sqlYulan").val("");
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        saveTableInfo:function(hBusinessTable){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "POST",
                url: "/sentosa/hiveManage/createTable",
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(hBusinessTable),
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        location.href = "hiveTableList.html?hdb="+_this.hdb+"&pid="+_this.pid;
                    } else {
                        $.showModal({content: result.message});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
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
                        _this.getKu();
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
        },

        getLeftKu: function () {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/hives",
                data: {},
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var pairs = result.pairs;
                        var strHtml = "";
                        var k = 0;
                        for (var r in pairs) {
                            var secondElms = pairs[r];
                            var sHtml = '<div class="box box-solid">'
                                + '<div class="box-header with-border">'
                                + '<h3 class="box-title">' + r + '</h3>'
                                + '<div class="box-tools">'
                                + '<button class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>'
                                + '</div>'
                                + '</div>'
                                + '<div class="box-body no-padding" style="disaplay: block;">'
                                + '<ul class="nav nav-pills nav-stacked">';
                            for (var i = 0; i < secondElms.length; i++) {
                                if(_this.hdb == null){
                                    sHtml = sHtml + '<li><a href="javascript:void(0);" data-id="' + secondElms[i].id + '"><i class="fa fa-tablet ' + ((i == 0 && k == 0) ? "text-light-blue" : "") + '"></i>' + secondElms[i].name + '</a></li>'
                                }else{
                                    if(_this.hdb == secondElms[i].id){
                                        sHtml = sHtml + '<li><a href="javascript:void(0);" data-id="' + secondElms[i].id + '"><i class="fa fa-tablet text-light-blue"></i>' + secondElms[i].name + '</a></li>'
                                    }else{
                                        sHtml = sHtml + '<li><a href="javascript:void(0);" data-id="' + secondElms[i].id + '"><i class="fa fa-tablet"></i>' + secondElms[i].name + '</a></li>'
                                    }
                                }
                            }
                            sHtml = sHtml + '</ul>'
                                + '</div>'
                                + '</div>';
                            strHtml = strHtml + sHtml;
                            k++;
                        }
                        $("#leftKu").html(strHtml);
                        _this.getDB();
                    } else {
                        $.showModal({content: "添加失败,请刷新重试"});
                    }
                },
                error: function (a, b, c) {
                    JQloading.showLading(false);
                    alert(a.responseText);
                }
            });
        },

        getDB: function () {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/group/all",
                data: {
                    groupId:$("#leftKu").find("i.text-light-blue").parent().attr("data-id")
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        $("#sdb").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#sdb").changeValue(function () {
                            var id = $(this).attr("data-value");
                            $("#sku").val("");
                            $("#sTable").val("");
                            $("#hiveZiduan").empty();
                            _this.getKu(id);
                        });
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getKu: function () {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/hiveManage/showDatabases",
                data: {
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.hDatabases;
                        $("#sku").quickSearch({
                            data: dat,
                            text: "dbName",
                            value: "dbName",
                            width: "400px"
                        });
                        $("#sku").changeValue(function () {
                            var dbName = $(this).attr("data-value");
                            $("#sTable").val("");
                            $("#hiveZiduan").empty();
                            _this.getTable(dbName);
                        });
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        getTable: function (dbName) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/hiveManage/showTables",
                data: {
                    dbName: dbName
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.hTables;
                        $("#sTable").quickSearch({
                            data: dat,
                            text: "tabName",
                            value: "tabName",
                            width: "400px"
                        });
                        $("#sTable").changeValue(function () {
                            debugger;
                            var tableName = $(this).attr("data-value");
                            _this.getTableElm(tableName,dbName);
                        });
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getTableElm: function (tableName,dbName) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/hiveManage/describeTableInfo",
                data: {
                    tabName: tableName,
                    dbName:dbName
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.hTable.hColumns;
                        var hPartitionKeys = result.pairs.hTable.hPartitionKeys;
                        $("#location").val(result.pairs.hTable.tabLocationUri);
                        _this.setTableElm(dat);
                        _this.setPartitionKeyElm(hPartitionKeys);
                    } else {
                        $.showModal({content: "查询失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setTableElm: function (dat) {
            $("#hiveZiduan").empty();
            for (var i = 0; i < dat.length; i++) {
                var str = '<tr data-columnId="'+dat[i].columnId+'">'
                    + '<td>'
                    + '<div class="radio">'
                    + '<label>'
                    + '<input type="radio" name="optionsRadios" >'
                    + '</label>'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<div class="input-group-sm">'
                    + '<input type="text" class="form-control" value="' + dat[i].columnName + '" placeholder="">'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + this.setSelectStr(dat[i].columnType)
                    + '</td>'
                    + '<td>'
                    + this.setDecimalStr(dat[i].columnType)
                    + '</td>'
                    + '<td>'
                    + '<div class="input-group-sm">'
                    + '<input type="text" class="form-control" value="' + dat[i].columnComment + '" placeholder="">'
                    + '</div>'
                    + '</td>'
                    + '</tr>';
                $("#hiveZiduan").append(str);
            }
            $("#hiveZiduan .jingduinput").numeral();
        },

        setPartitionKeyElm:function(dat){
            $("#hiveFenquZiduan").empty();
            for(var i=0;i<dat.length;i++){
                var strHtml = '<tr>'
                    + '<td>'
                    + '<div class="radio">'
                    + '<label>'
                    + '<input type="radio" name="fenquziduans" value="1">'
                    + '</label>'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<div class="input-group-sm">'
                    + '<input type="text" class="form-control" value="'+dat[i].pKeyNAME+'" placeholder="">'
                    + '</div>'
                    + '</td>'
                    + '<td>'
                    + '<select>'
                    + '<option value="STRING" SELECTED>STRING</option>'
                    + '</select>'
                    + '</td>'
                    + '<td>'
                    + '<div class="input-group-sm">'
                    + '<input type="text" class="form-control" value="'+dat[i].pKeyComment+'" placeholder="">'
                    + '</div>'
                    + '</td>'
                    + '</tr>';
                $("#hiveFenquZiduan").html(strHtml);
            }

        },

        setDecimalStr:function(type){
            type = type.toUpperCase();
            if((type.indexOf("NUMERIC")>-1||type.indexOf("DECIMAL")>-1 || type.indexOf("NUMBER")>-1 || type.indexOf("DOUBLE")>-1 || type.indexOf("REAL")>-1  )){
                return '<div class="input-group-sm">'
                    +'<input type="text" class="form-control jingduinput" data-value="20" value="20" placeholder="">'
                    +'<input type="text" class="form-control jingduinput" data-value="2" value="2" placeholder="">'
                    +'</div>';
            }
            return '<div class="input-group-sm">'
                +'<input type="text" class="form-control jingduinput" data-value="20" value="20" placeholder="" style="visibility:hidden;">'
                +'<input type="text" class="form-control jingduinput" data-value="2" value="2" placeholder="" style="visibility:hidden;">'
                +'</div>';
        },

        setSelectStr: function (type) {
            type = type.toUpperCase();
            var types = {
                BIGINT: "BIGINT",
                BINARY: "STRING",
                BIT: "STRING",
                BLOB: "STRING",
                BOOL: "TINYINT",
                BOOLEAN: "TINYINT",
                CHAR: "STING",
                DATE: "DATE",
                DATETIME: "TIMESTAMP",
                DECIMAL: "DECIMAL",
                DOUBLE: "DECIMAL",
                ENUM: "STRING",
                FLOAT: "FLOAT",
                INT: "INT",
                LONGBLOB: "STRING",
                LONGTEXT: "STRING",
                MEDIUMBLOB: "STRING",
                MEDIUMINT: "BIGINT",
                MEDIUMTEXT: "STRING",
                NUMERIC: "DECIMAL",
                REAL: "DOUBLE",
                SET: "STRING",
                SMALLINT: "INT",
                TEXT: "STRING",
                TIME: "STRING",
                TIMESTAMP: "TIMESTAMP",
                TINYBLOB: "STRING",
                TINYINT: "TINYINT",
                TINYTEXT: "STRING",
                VARBINARY: "STRING",
                VARCHAR: "STRING",
                YEAR: "STRING",
                NUMBER:"DECIMAL"
            };
            var hiveTypes = ["STRING","BIGINT","TINYINT","DATE","TIMESTAMP","DOUBLE","FLOAT","INT","DECIMAL"];

            var str = '<select class="leixing">';
            for(var i=0;i<hiveTypes.length;i++){
                var t = types[type.toUpperCase()];
                if((type.indexOf("NUMERIC")>-1||type.indexOf("DECIMAL")>-1 || type.indexOf("NUMBER")>-1 || type.indexOf("DOUBLE")>-1 || type.indexOf("REAL")>-1  )){
                    str = str + '<option value="'+hiveTypes[i]+'" selected>'+hiveTypes[i]+'</option>';
                }else{
                    if(hiveTypes[i] == t){
                        str = str + '<option value="'+hiveTypes[i]+'" selected>'+hiveTypes[i]+'</option>';
                    }else{
                        str = str + '<option value="'+hiveTypes[i]+'">'+hiveTypes[i]+'</option>';
                    }
                }
            }
            str = str + '</select>';
            return str;
        }




    };
    hiveOutTableAdd.init();
});
