/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var dbModifyOne = {

        groupId:"",

        obj:null,

        init:function(){
            this.initEvent();
            this.groupId = $.getQueryString("groupId");
            this.getInfo();
        },

        initEvent:function(){
            var _this = this;

            //$(".dbMoreNames").delegate(".badge ","click",function(){
            //    var __$this = $(this);
            //    $.showModal({
            //        content:"确定要删除该库么?",
            //        sureCallBack:function(){
            //            __$this.parent().remove();
            //        },
            //        title:"提示信息"
            //    });
            //});

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
        },

        getInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/group/get",
                data: {groupId:_this.groupId},
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        _this.obj = result.pairs.dat;
                        _this.setValues();
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

        setValues:function(){
            var _this = this;
            $("#dbjiancheng").val(_this.obj.name);
            $("#host").val(_this.obj.dbList[0].host);
            $("#port").val(_this.obj.dbList[0].port);
            $("#qudongType").val(_this.obj.dbList[0].driverType);
            if(_this.obj.dbList[0].driverType == "oracle"){
                $(".oracleUse").show();
                $("#select_username").val(this.obj.dbList[0].selectUserName);
            }
            $("#database").val(_this.obj.dbList[0].name);
            $("#username").val(_this.obj.dbList[0].userName);
            $("#password").val(_this.obj.dbList[0].password);
            $("#desc").val(_this.obj.note);
        },

        saveKu:function(){
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
            if(verifyFlag){
                if($("#qudongType").val() == "oracle"){
                    var select_username = $("#select_username").val();
                    if($.trim(select_username) == ""){
                        showTip("select_username 不能为空.");
                        return;
                    }
                }
                _this.obj.dbList[0].driverType = $("#qudongType").val();
                _this.obj.dbList[0].selectUserName = $("#select_username").val();
                _this.obj.dbList[0].host = $("#host").val();
                _this.obj.dbList[0].port = $("#port").val();
                _this.obj.dbList[0].name = $("#database").val();
                _this.obj.dbList[0].userName = $("#username").val();
                _this.obj.dbList[0].password = $("#password").val();

                _this.obj.name = $("#dbjiancheng").val();
                _this.obj.note = $("#desc").val();

                showloading(true);
                $.ajax({
                    type: "post",
                    url: "/sentosa/metadata/group/modify",
                    dataType:"json",
                    contentType: 'application/json',
                    data: JSON.stringify(_this.obj),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            location.href = "dbList.html";
                        }else{
                            $.showModal({content:result.message});
                        }
                    },
                    error:function(a,b,c){
                        showloading(false);
                        alert(a.responseText);
                    }
                });
            }
        }

    };
    dbModifyOne.init();
});
