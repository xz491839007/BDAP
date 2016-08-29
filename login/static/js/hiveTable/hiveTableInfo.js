/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var hiveTableInfo = {

        hdb:"",

        tableId:"",

        init:function(){
            this.initEvent();
            this.hdb = $.getQueryString("hdb");
            this.tableId = $.getQueryString("tableId");
            this.getInfo();
        },

        initEvent:function(){
            var _this = this;

        },


        getInfo: function () {
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/table/get",
                data: {
                    tableId: _this.tableId,
                    cascade: true
                },
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        var dat = result.pairs.dat;
                        _this.setInfo(dat);
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

        setInfo: function (dat) {
            this.orginDate = dat;
            debugger;
            $("#biaoming").val(dat.name);
            $("#desc").val(dat.chineseName);
            $("#jishi").val(dat.dbName);
            $("#miaoshu").val(dat.note);
            $("#fuzeren").val(dat.creator);
            $("#jiqun").val(dat.location);
            $("#atime").val((new Date(dat.createTime)).Format("yyyy-MM-dd"));
            $("#ctime").val((new Date(dat.timestamp)).Format("yyyy-MM-dd"));
            $("#atime").val(dat.createTime);


            var hiveType = dat.hiveType;
            if(hiveType == "MANAGED_TABLE"){
                $("#biaoguanxi").val("内部表");
            }else{
                $("#biaoguanxi").val("外部表");
            }

            this.setTableElm(dat.columnList);
        },

        setTableElm:function(data){
            debugger;
            for(var i=0;i<data.length;i++){
                var isPartitionClass = "";
                if(data[i].isPartition == 1){
                    isPartitionClass = "isPartitionClass";
                }
                var shtml = '<tr class="'+isPartitionClass+'">'
                    +'<th>'+data[i].name+'</th>'
                    +'<th>'+data[i].type+'</th>'
                    +'<th>'+data[i].note+'</th>'
                    +'</tr>';
                $("#tableStr").append(shtml);
            }

        }


    };
    hiveTableInfo.init();
});
