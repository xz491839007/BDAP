/**
 * Created by user on 16/6/20.
 */

require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var upload = {

        id:null,//如果不为空则表示修改

        isModifyFirstFlag:true,

        init:function(){
            this.initEvent();
            this.getUser();
            this.getHiveKu();
            this.id = $.getQueryString("id");
            if(this.id != null){
                this.getInfo();
                $("#id").val(this.id);
            }
        },

        initEvent:function(){
            var _this = this;

            //添加联系人
            $(".myuserUl").delegate("li a", "click", function () {
                $(".myuserUl li a").removeClass("active");
                $(this).addClass("active");
                var loginName = $(this).attr("data-loginName");
                var id = $(this).attr("data-id");
                if ($(".selectUsers").find("a[data-id=" + id + "]").length <= 0) {
                    $(".selectUsers").append('<a class="btn btn-app" data-id="' + id + '" data-loginName="' + loginName + '">'
                        + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                        + loginName
                        + '</a>');
                }
            });

            $("#addUserBut").click(function () {
                if(_this.id != null && _this.isModifyFirstFlag){
                    _this.isModifyFirstFlag = false;
                    var fuzeren = $("#administrator").val().split(",");
                    for(var  i=0;i<fuzeren.length;i++){
                        $(".selectUsers").append('<a class="btn btn-app"  data-loginName="' + $.trim(fuzeren[i]) + '">'
                            + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                            + $.trim(fuzeren[i])
                            + '</a>');
                    }
                }
                $("#userModal").modal("toggle");

            });

            $("#quickSearchName").keyup(function (e) {
                var e = e || window.event;
                var value = $(this).val();
                if (e.keyCode != 38 && e.keyCode != 40) {
                    _this.quickTimeOut = setTimeout(function () {
                        _this.getUser(value);
                    }, 500)
                }
            });
            $("#quickSearchName").keydown(function (e) {
                var e = e || window.event;
                clearTimeout(_this.quickTimeOut);
            });
            $("#addFuzeren").click(function () {
                var selectUsers = $(".selectUsers a");
                var userIds = [], userLoginNames = [];
                for (var i = 0; i < selectUsers.length; i++) {
                    userIds.push(selectUsers.eq(i).attr("data-id"));
                    userLoginNames.push(selectUsers.eq(i).attr("data-loginName"));
                }
                $("#administrator").val(userLoginNames.join(", ")).attr("data-id", userIds.join(","));
                $("#userModal").modal("hide");
            });

            $(".selectUsers").delegate('.badge', "click", function () {
                $(this).parent().remove();
            });

            $("#addOne").click(function(){
                _this.saveImport();
            });

        },

        saveImport:function(){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"name",label:"任务名称"},
                    {name:"administrator",label:"负责人"},
                    {name:"database",label:"hive库"},
                    {name:"table",label:"hive表"}
                ]
            );
            if(verifyFlag){
                var partValues = $("#yuanElm input[name=partValue]");
                for(var i=0;i<partValues.length;i++){
                    if($.trim(partValues.eq(i).val()) == ""){
                        showTip("分区字段值弟"+(i+1)+"行不能为空");
                        return;
                    }
                }
                if(this.id == null){
                    var file = $("#file").val();
                    if(file == ""){
                        showTip("文件不能不能为空");
                        return;
                    }
                }else{
                    var file = $("#file").val();
                    if(file != ""){
                        $.showModal({
                            content:"该文件内容会覆盖原有的内容,不可恢复,请确认",
                            closeCallBack:null,
                            sureCallBack:function(){
                                _this.formSublimt();
                            },
                            title:"提示信息",
                            closeName:"关闭",
                            sureName:"确定"
                        });
                        return;
                    }
                }
                _this.formSublimt();

            }

        },

        formSublimt:function(){
            $("#form").submit();
            window._inter = setInterval(function(){
                var pre = $("#callbackIframe")[0].contentWindow.document.getElementsByTagName('pre')[0];
                if(pre){
                    var callBack = pre.innerHTML,result = JSON.parse(callBack);
                    if(result && result.success){
                        showTip("保存成功");
                        location.href = "uploadList.html";
                    }else{
                        $.showModal({content: "保存失败:"+result.message});
                    }
                    clearInterval(window._inter);
                }
            },500);
        },

        getInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/fileUpload/local/get",
                data: {
                    id:_this.id
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.fileUpload;
                        $("#name").val(dat.name);
                        $("#administrator").val(dat.administrator);
                        $("#share").val(dat.share);
                        $("#database").val(dat.database);
                        $("#databaseId").val(dat.databaseId);
                        $("#table").val(dat.table);
                        $("#tableId").val(dat.tableId);
                        $("#describe").val(dat.describe);
                        _this.getTable(dat.databaseId);
                        _this.getColums(dat.tableId);
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

        getHiveKu:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/hives",
                data: {
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var innerHiveDBs = result.pairs.innerHiveDBs,marketHiveDBs = result.pairs.marketHiveDBs;
                        var dat = innerHiveDBs.concat(marketHiveDBs);
                        $("#database").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#database").changeValue(function () {
                            var id = $(this).attr("data-value");
                            $("#table").val("");
                            $("#tableId").val("");
                            $("#yuanElm").empty();
                            $(".partitionDiv").hide();
                            $("#databaseId").val(id);
                            _this.getTable(id);
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
        getTable:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/table/list",
                data: {
                    dbId: id
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        debugger;
                        var dat = result.pairs.dat;
                        $("#table").quickSearch({
                            data: dat,
                            text: "name",
                            value: "id",
                            width: "400px"
                        });
                        $("#table").changeValue(function () {
                            var id = $(this).attr("data-value");
                            $("#yuanElm").empty();
                            $(".partitionDiv").hide();
                            $("#tableId").val(id);
                            _this.getColums(id);
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

        getColums:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/table/column/list",
                data: {
                    tableId: id
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        _this.setPartitionEml(dat);
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
        setPartitionEml:function(dat){
            $("#yuanElm").empty();
            var flag = false;
            for(var i=0;i<dat.length;i++){
                if(dat[i].isPartition == 1){
                    flag = true;
                    $("#yuanElm").append('<tr>'
                        +'<td>'+dat[i].name+'</td>'
                        +'<td>'
                        + '<div class="input-group-sm">'
                        + '<input type="text" data-name="'+dat[i].name+'" name="partValue" data-id="'+dat[i].id+'" class="form-control" placeholder="">'
                        + '</div>'
                        +'</td>'
                        +'</tr>');
                }

            }
            if(flag) $(".partitionDiv").show();
        },
        getUser: function (loginName) {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/users/search",
                global: false,
                data: {
                    loginName: $.trim(loginName)
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        _this.setUserDig(result.pairs.dat);
                    } else {
                        $.showModal({conent: "查询联系人失败"});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setUserDig: function (dat) {
            $(".myuserUl").empty();
            for (var i = 0; i < dat.length; i++) {
                $(".myuserUl").append('<li><a data-id="' + dat[i].id + '" data-loginName="' + dat[i].loginName + '" data-realName="' + dat[i].realName + '" href="javascript:void(0);">' + dat[i].realName + '  ' + dat[i].mail + ' ' + dat[i].groupName + '</a></li>');
            }
        }

    };
    upload.init();
});
