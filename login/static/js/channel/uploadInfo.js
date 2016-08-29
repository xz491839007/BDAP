/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($,d3){
    var uploadInfo = {

        id:"",

        init:function(){
            this.initEvent();
            this.id = $.getQueryString("id");
            this.getInfo();
        },

        initEvent:function(){
            var _this = this;

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
                        $("#share").val(dat.share==0?"是":"否");
                        $("#database").val(dat.database);
                        $("#table").val(dat.table);
                        $("#describe").val(dat.describe);
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
            var fenqus = [];
            for(var i=0;i<dat.length;i++){
                if(dat[i].isPartition == 1){
                    fenqus.push(dat[i].name);
                }

            }
            $("#fenqus").val(fenqus.join(","));
        },


    };
    uploadInfo.init();
});
