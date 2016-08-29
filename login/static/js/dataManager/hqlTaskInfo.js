require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var hqlTaskInfo = {

        id:"",

        script:null,

        isModifyFirstFlag:true,

        init:function(){
            this.id = $.getQueryString("id");
            this.initEvent();
            this.getInfo();
            this.getUser();
        },

        initEvent:function(){
            var _this = this;

            $(".myuserUl").delegate("li a", "click", function () {
                $(".myuserUl li a").removeClass("active");
                $(this).addClass("active");
                var loginName = $(this).attr("data-loginName");
                var id = $(this).attr("data-id");
                if ($(".selectUsers").find("a[data-loginName='" + loginName + "']").length <= 0) {
                    $(".selectUsers").append('<a class="btn btn-app" data-id="' + id + '" data-loginName="' + loginName + '">'
                        + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                        + loginName
                        + '</a>');
                }
            });

            //添加联系人
            $("#addUserBut").click(function () {
                if(_this.isModifyFirstFlag){
                    _this.isModifyFirstFlag = false;
                    var fuzeren = $("#userNames").val().split(",");
                    for(var  i=0;i<fuzeren.length;i++){
                        $(".selectUsers").append('<a class="btn btn-app"  data-loginName="' + $.trim(fuzeren[i]) + '">'
                            + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                            + $.trim(fuzeren[i])
                            + '</a>');
                    }
                }else{
                    $("#userModal").modal("toggle");
                }
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
                $("#userNames").val(userLoginNames.join(", ")).attr("data-id", userIds.join(","));
                $("#userModal").modal("hide");
            });

            $(".selectUsers").delegate('.badge', "click", function () {
                $(this).parent().remove();
            });

            $("#saveInfo").click(function(){
                _this.saveInfo();
            });

        },

        saveInfo:function(){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"userNames",label:"负责人"},
                    {name:"desc",label:"描述"}
                ]
            );

            if(verifyFlag) {
                _this.script.administrator = $("#userNames").val();
                _this.script.describe = $("#desc").val();
                showloading(true);
                $.ajax({
                    type: "post",
                    url: "/sentosa/transform/script/updateScript",
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(_this.script),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            location.href = "hqlTaskList.html";
                        }else{
                            $.showModal({content:"保存失败"+result.message});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        },

        getInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/transform/script/queryScript",
                data: {
                    id:_this.id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        debugger;
                        var dat = result.pairs.script;
                        _this.setDataInfo(dat);
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

        setDataInfo:function(dat){
            this.script = dat;
            $("#name").val(dat.name);
            $("#userNames").val(dat.administrator);
            $("#sql").val(dat.context);
            $("#desc").val(dat.describe);
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
    hqlTaskInfo.init();

});
