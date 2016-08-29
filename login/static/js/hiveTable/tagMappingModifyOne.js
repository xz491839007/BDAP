/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var tagMappingModifyOne = {

        tableId :"",

        tableName:"",

        initData:"",

        init:function(){
            this.initEvent();
            this.tableId = $.getQueryString("tableId");
            this.tableName = $.getQueryString("tableName");
            $("#tableNameTit").html("表名:"+this.tableName);
            this.getTableTag();
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
            var labelIds = [];
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
                url: "/sentosa/metadata/label/relation/bind/single",
                data: {
                    tableId:_this.tableId,
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

        getTableTag:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/metadata/label/relation",
                data: {
                    tableId:_this.tableId
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        _this.initData = dat;
                        _this.getInfo();
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
                    if(this.hasInitLabel(labelList[j].id)){
                        labelHtml = labelHtml + '<div class="tagOuter select" data-id="'+labelList[j].id+'" data-themeId="'+labelList[j].themeId+'">'
                            +'<div class="tagInner">'
                            +'<span class="fa fa-paperclip tagIcon"></span>'
                            +'<span class="tabConent">'+labelList[j].name+'</span>'
                            +'<span class="fa fa-fw fa-check"></span>'
                            +'</div>'
                            +'</div>';
                    }else{
                        labelHtml = labelHtml + '<div class="tagOuter noselect" data-id="'+labelList[j].id+'" data-themeId="'+labelList[j].themeId+'">'
                            +'<div class="tagInner">'
                            +'<span class="fa fa-paperclip tagIcon"></span>'
                            +'<span class="tabConent">'+labelList[j].name+'</span>'
                            +'<span class="fa fa-fw fa-check"></span>'
                            +'</div>'
                            +'</div>';
                    }

                }
                shtml = shtml + labelHtml
                    +'</div>'
                    +'</div>'
                    +'</div>';

                $("#tagsList").append(shtml);
            }
        },

        hasInitLabel:function(labelId){
            for(var i=0;i<this.initData.length;i++){
                if(this.initData[i].labelId == labelId){
                    return true;
                }
            }
            return false;
        }

    };
    tagMappingModifyOne.init();
});
