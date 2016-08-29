/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var quotaModify = {

        id:"",

        init:function(){
            this.initEvent();
            this.id = $.getQueryString("id");
            this.getInfo();
        },

        initEvent:function(){
            var _this = this;
            $("#addOne").click(function(){
                _this.saveKu(true);
            });

            $("#columType").change(function(){
                var value  = $(this).val();
                if(value == "DECIMAL"){
                    $(".jingdongDiv").show();
                }else{
                    $(".jingdongDiv").hide();
                }
            });
        },

        saveKu:function(flag){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"ename",label:"指标名(英文)"},
                    {name:"cname",label:"指标名(中文)"},
                    {name:"columType",label:"指标字段类型"},
                    {name:"quotaType",label:"指标类型"},
                    {name:"desc",label:"指标说明"}
                ]
            );
            if(verifyFlag){
                var data = {
                    id:_this.id,
                    name: $("#ename").val(),
                    chineseName:$("#cname").val(),
                    columnType:$("#columType").val(),
                    type:$("#quotaType").val(),
                    note:$("#desc").val()
                };
                $.ajax({
                    type: "post",
                    url: "/sentosa/metadata/quota/modify",
                    dataType:"json",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("修改成功!");
                            setTimeout(function(){
                                location.href = "quotaList.html";
                            },500);
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



        getInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/quota/get",
                data: {id:_this.id},
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        _this.setValues(dat);
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

        setValues:function(dat){
            $("#ename").val(dat.name);
            $("#cname").val(dat.chineseName);

            var columnType = dat.columnType;
            if(columnType.toUpperCase().indexOf("DECIMAL")>-1){
                $("#columType").val("DECIMAL");
                var type = columnType.toUpperCase();

                var rn = type.replace(/NUMERIC/, "").replace(/DECIMAL/, "").replace(/REAL/, "").replace(/\(/, "").replace(/\)/, "");
                var rnSplit = rn.split(",");

                $("#num1").val(rnSplit[0]);
                $("#num2").val(rnSplit[1]);
                $(".jingdongDiv").show();
            }else{
                $("#columType").val(columnType);
            }



            $("#quotaType").val(dat.type);
            $("#desc").val(dat.note);
        }
    };
    quotaModify.init();
});
