/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var tagMappingModifyMore = {

        init:function(){
            this.initEvent();
            this.getInfo();
            this.getCangkuKU();
        },

        initEvent:function(){
            var _this = this;

            $("#tagsList").delegate(".tagOuter",'click',function(){
                if($(this).hasClass("noselect")){
                    $(this).removeClass("noselect");
                    $(this).addClass("select");
                }else{
                    $(this).removeClass("select");
                    $(this).addClass("noselect");
                }
            });

            $("#tagsList").delegate(".titleButs .faall","click",function(){
                var outers = $(this).parent().parent().parent().find(".tagOuter");
                if(outers.hasClass("noselect")){
                    outers.removeClass("noselect");
                    outers.addClass("select");
                }else{
                    outers.removeClass("select");
                    outers.addClass("noselect");
                }
            });

            $("#cangku").change(function(){
                var value = $(this).val();
                if(value != ""){
                    _this.getTables(value);
                }
            });

            $("#selectAllBut").click(function(){
                var outers = $("#tagsList").find(".tagOuter");
                if(outers.hasClass("noselect")){
                    outers.removeClass("noselect");
                    outers.addClass("select");
                }else{
                    outers.removeClass("select");
                    outers.addClass("noselect");
                }
            });
            $("#save").click(function(){
                _this.saveTags();
            });

            $("#selectTableAllBut").click(function(){
                var lis = $("#tagTablesUl li"),lisActive = $("#tagTablesUl li.active");
                if(lis.length != lisActive.length){
                    lis.addClass("active");
                    lis.find(".fa").removeClass("fa-square-o").addClass("fa-check-square-o");
                }else{
                    lis.removeClass("active");
                    lis.find(".fa").removeClass("fa-check-square-o").addClass("fa-square-o");
                }
            });

            $("#tagTablesUl").delegate("li","click",function(){
                if($(this).hasClass("active")){
                    $(this).removeClass("active");
                    $(this).find(".fa").removeClass("fa-check-square-o").addClass("fa-square-o");
                }else{
                    $(this).addClass("active");
                    $(this).find(".fa").removeClass("fa-square-o").addClass("fa-check-square-o");
                }
            });

        },

        saveTags:function(){
            var _this = this;
            _this.doSave();
        },

        doSave:function(themes){
            var _this = this;
            var tableIds = [],labelIds = [];
            var tableLis = $("#tagTablesUl li.active");
            if(tableLis.length <= 0){
                showTip("请至少选择一个表");
                return;
            }
            for(var i=0;i<tableLis.length;i++){
                tableIds.push(tableLis.eq(i).attr("data-id"));
            }

            var tagList = $("#tagsList .tagOuter.select");
            if(tagList.length <= 0){
                showTip("请至少选择一个标签");
                return;
            }
            for(var j=0;j<tagList.length;j++){
                labelIds.push(tagList.eq(j).attr("data-id"));
            }

            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/label/relation/bind/batch",
                data: {
                    tableIds:tableIds.join(","),
                    labelIds:labelIds.join(",")
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("保存成功.")
                        location.href = 'tagMapping.html';
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

        getInfo:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/theme/list/all/withlabels",
                data: {
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
            $("#tagsList").html("");
            for(var i=0;i<dat.length;i++){
                var shtml = '<div class="col-md-12">'
                    +'<div class="info-box tagInfoBox tagInfoMes selectTags"  data-id="'+dat[i].id+'">'
                    +'<div class="info-box-icon bg-aqua tagTitle">'
                    +'<div class="titleButs">'
                    +'<span class="faall">全选</span>'
                    +'</div>'
                    +'<span class="titleSpan">'+dat[i].name+'</span>'
                    +'</div>'
                    +'<div class="info-box-content tagParent">';

                var labelList = dat[i].labelList;
                var labelHtml = '';
                for(var j=0;j<labelList.length;j++){
                    labelHtml = labelHtml + '<div class="tagOuter noselect" data-id="'+labelList[j].id+'" data-themeId="'+labelList[j].themeId+'">'
                        +'<div class="tagInner">'
                        +'<span class="fa fa-paperclip tagIcon"></span>'
                        +'<span class="tabConent">'+labelList[j].name+'</span>'
                        +'<span class="fa fa-fw fa-check"></span>'
                        +'</div>'
                        +'</div>';
                }
                shtml = shtml + labelHtml
                    +'</div>'
                    +'</div>'
                    +'</div>';

                $("#tagsList").append(shtml);
            }
        },

        getCangkuKU: function () {
            var _this = this;
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/inner/hives",
                data: {},
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        _this.setCangkuKU(result.pairs.innerHiveDBs);
                    } else {
                        $.showModal({content: "查询失败" + result.message});
                    }
                },
                error: function (a, b, c) {
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setCangkuKU: function (data) {
            var cangku = $("#cangku");
            cangku.html("");
            cangku.append('<option value="-100">-请选择-</option>');
            for (var i = 0; i < data.length; i++) {
                cangku.append('<option value="' + data[i].id + '">' + data[i].name + '</option>');
            }
        },

        getTables:function(id){
            var _this = this;
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/db/table/list",
                data: {
                    dbId:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        _this.setTableInfo(result.pairs.dat);
                    }else{
                        $.showModal({content:"查询失败"+result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        setTableInfo:function(data){
            this._tables = data;
            var tables = $("#tagTablesUl");
            tables.html("");
            for(var i=0;i<data.length;i++){
                var str ='<li data-id="'+data[i].id+'">'
                    +'<i class="fa fa-fw fa-square-o"></i>'
                    +'<span class="cont" title="'+data[i].name+'">'+data[i].name+'</span>'
                    +'</li>';
                tables.append(str);
            }
        },

    };
    tagMappingModifyMore.init();
});
