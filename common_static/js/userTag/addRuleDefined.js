/**
 * Created by user on 16/6/20.
 */

require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var addRuleDefined = {

        id:null,//如果不为空则表示修改

        isModifyFirstFlag:true,

        init:function(){
            this.initEvent();
            //this.id = $.getQueryString("id");
            //if(this.id != null){
            //    this.getInfo();
            //    $("#id").val(this.id);
            //}
        },

        initEvent:function(){
            var _this = this;

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
        }

    };
    addRuleDefined.init();
});
