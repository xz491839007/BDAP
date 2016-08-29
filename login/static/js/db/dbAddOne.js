/**
 * Created by user on 16/6/20.
 */

require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var dbAddOne = {

        init:function(){
            this.initEvent();
        },

        initEvent:function(){
            var _this = this;

            $(".dbMoreNames").delegate(".badge ","click",function(){
                var __$this = $(this);
                $.showModal({
                    content:"确定要删除该库么?",
                    sureCallBack:function(){
                        __$this.parent().remove();
                    },
                    title:"提示信息"
                });
            });

            $("#qudongType").change(function(){
                var val = $(this).val();
                if(val == "oracle"){
                    $(".oracleUse").show();
                }else{
                    $(".oracleUse").hide();
                }
            });

            $("#addNext").click(function(){
                _this.saveKu();
            });

            $("#addOne").click(function(){
                _this.saveKu(true);
            });

            $("#dbjiancheng").blur(function(){
                var value = $(this).val();
                _this.checkName(value);
            });

            $("#testCont").click(function(){
                _this.testCont();
            });
        },

        testCont:function(){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"host",label:"HOST"},
                    {name:"port",label:"PORT"},
                    {name:"database",label:"DataBase"},
                    {name:"username",label:"username"},
                    {name:"password",label:"passowrd"}
                ]
            );
            if(verifyFlag){
                if($("#qudongType").val() == "oracle"){
                    var select_username = $("#select_username").val();
                    if($.trim(select_username) == ""){
                        showTip("select_username 不能为空.");
                        return;
                    }
                }
                var dbList = {
                    driverType:$("#qudongType").val(),
                    selectUserName:$("#select_username").val(),
                    host:$("#host").val(),
                    port:$("#port").val(),
                    name:$("#database").val(),
                    userName:$("#username").val(),
                    password:$("#password").val()
                };

                debugger;
                $.ajax({
                    type: "post",
                    url: "/sentosa/metadata/db/test",
                    dataType:"json",
                    contentType: 'application/json',
                    data: JSON.stringify(dbList),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("测试连接成功!");
                        }else{
                            $.showModal({content:result.message||"测试连接失败"});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        },

        checkName:function(value){
            if($.trim(value)==""){
                return;
            }
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/group/exists",
                data: {
                    name:value
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

        saveKu:function(flag){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"dbjiancheng",label:"DB简介"},
                    {name:"host",label:"HOST"},
                    {name:"port",label:"PORT"},
                    {name:"database",label:"DataBase"},
                    {name:"username",label:"username"},
                    {name:"password",label:"passowrd"},
                    {name:"desc",label:"描述"}
                ]
            );
            if($("#enameError").css("display") != "none"){
                return;
            }
            if(verifyFlag){
                if($("#qudongType").val() == "oracle"){
                    var select_username = $("#select_username").val();
                    if($.trim(select_username) == ""){
                        showTip("select_username 不能为空.");
                        return;
                    }
                }
                var dbList = [{
                    driverType:$("#qudongType").val(),
                    selectUserName:$("#select_username").val(),
                    host:$("#host").val(),
                    port:$("#port").val(),
                    name:$("#database").val(),
                    userName:$("#username").val(),
                    password:$("#password").val(),
                    creator:"dbAddOne测试用户",
                }];

                var group = {
                    name: $("#dbjiancheng").val(),
                    isMulti:0,
                    dbList:dbList,
                    creator:"dbAddOne测试用户",
                    note:$("#desc").val()
                };
                debugger;
                $.ajax({
                    type: "post",
                    url: "/sentosa/metadata/group/create",
                    dataType:"json",
                    contentType: 'application/json',
                    data: JSON.stringify(group),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("保存成功!");
                            if(flag){
                                location.href = "dbList.html";
                            }
                            _this.setSaveList();
                        }else{
                            $.showModal({content:result.message||"保存失败"});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        },

        setSaveList:function(){
            var strHtml = '<a class="btn btn-app">'
                +'<i class="fa fa-th-large"></i>'+ $("#dbjiancheng").val()
                +'</a>';
            $(".dbMoreNames").append(strHtml);
        }

    }
    dbAddOne.init();
});
