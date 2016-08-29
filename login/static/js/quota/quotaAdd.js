/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var quotaAdd = {

        init:function(){
            this.initEvent();
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
            var columType = $("#columType").val();
            if(columType == "DECIMAL"){
                var num1 = $("#num1").val();
                var num2 = $("#num2").val();
                if($.trim(num1)=="" || $.trim(num2)==""){
                    showTip("精度DECIMAL不能为空");
                    return;
                }
                columType = columType + "("+num1+","+num2+")";
            }
            if(verifyFlag){
                var data = {
                    name: $("#ename").val(),
                    chineseName:$("#cname").val(),
                    columnType:columType,
                    type:$("#quotaType").val(),
                    note:$("#desc").val()
                };
                $.ajax({
                    type: "post",
                    url: "/sentosa/metadata/quota/create",
                    dataType:"json",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("保存成功!");
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
        }

    };
    quotaAdd.init();
});
