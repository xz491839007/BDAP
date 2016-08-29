/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var tagManage = {

        init:function(){
            this.initEvent();
            this.getInfo();
        },

        initEvent:function(){
            var _this = this;

            $("#tags").delegate(".tagOuter .tabModify","click",function(){
                var tabConent = $(this).siblings(".tabConent"),contentValue = tabConent.html();
                var tagInput = $('<input type="text" data-value="'+contentValue+'" class="form-control tagInput" value="'+contentValue+'">');
                tabConent.replaceWith(tagInput);
                tagInput.focus();
            });
            $("#tags").delegate(".tagOuter .tagInput","blur",function(){
                var tagInput = $(this),tagInputValue = tagInput.val();
                if($.trim(tagInputValue) == ""){
                    tagInputValue = tagInput.attr("data-value");
                }
                var tabConent = $('<span class="tabConent">'+tagInputValue+'</span>');
                tagInput.replaceWith(tabConent);
            });
            $("#tags").delegate(".tagOuter .tabDelete","click",function(){
                $(this).parent().parent().fadeOut("500",function(){
                    $(this).remove();
                });
            });

            $("#tags").delegate(".titleButs .fa-pencil-square-o","click",function(){
                var title = $(this).parent().siblings("span"),value = title.html();
                var titleInput = $('<input type="text" data-value="'+value+'" class="form-control titleInput" value="'+value+'">');
                title.replaceWith(titleInput);
                titleInput.focus();
            });
            $("#tags").delegate(".titleButs .fa-times",'click',function(){
                var title = $(this).parent().siblings("span"),value = title.html();
                var tagCol = $(this).parent().parent().parent().parent();
                $.showModal({
                    content:"提示:是否确定删除标签 "+value+" ,及其所有的子标签?",
                    closeCallBack:null,
                    sureCallBack:function(){
                        tagCol.fadeOut("500",function(){
                            $(this).remove();
                        });
                    },
                    title:"提示信息",
                    closeName:"否",
                    sureName:"是"
                })
            });
            $("#tags").delegate(".titleButs .fa-arrows","click",function(){
                var bigFlag = $(this).attr("data-bigFlag");
                if(bigFlag != "true"){
                    var tagTitle = $(this).parent().parent();
                    tagTitle.animate({
                        height: "414px"
                    }, 1000);
                    tagTitle.siblings(".tagParent").animate({
                        height: "414px"
                    }, 1000);
                    $(this).attr("data-bigFlag","true");
                }else{
                    var tagTitle = $(this).parent().parent();
                    tagTitle.animate({
                        height: "200px"
                    }, 1000);
                    tagTitle.siblings(".tagParent").animate({
                        height: "200px"
                    }, 1000);
                    $(this).attr("data-bigFlag","false");
                }
            });

            $("#tags").delegate(".tagTitle .titleInput","blur",function(){
                var titleInput = $(this),titleInputValue = titleInput.val();
                if($.trim(titleInputValue) == ""){
                    titleInputValue = titleInput.attr("data-value");
                }
                var title = $('<span class="titleSpan">'+titleInputValue+'</span>');
                titleInput.replaceWith(title);
            });
            $("#tags").delegate(".tagOuter .addSecondTag","click",function(){
                $(this).parent().before('<div class="tagOuter">'
                    +'<div class="tagInner">'
                    +'<span class="fa fa-paperclip tagIcon"></span>'
                    +'<span class="tabConent">子标签</span>'
                    +'<span class="fa fa-fw fa-pencil-square-o tabModify"></span>'
                    +'<span class="fa fa-fw fa-times tabDelete"></span>'
                    +'</div>'
                    +'</div>');
                var tag = $(this).parent().parent();
                tag.scrollTop(tag[0].scrollHeight);
            });

            $("#tagsList").delegate("#addFirstTagCol","click",function(){
                $("#addFirstTagCol").before('<div class="col-md-6">'
                    +'<div class="info-box tagInfoBox tagInfoMes">'
                    +'<div class="info-box-icon bg-aqua tagTitle">'
                    +'<div class="titleButs">'
                    +'<i class="fa fa-fw fa-arrows"></i>'
                    +'<i class="fa fa-fw fa-pencil-square-o"></i>'
                    +'<i class="fa fa-fw fa-times"></i>'
                    +'</div>'
                    +'<span class="titleSpan">新标签</span>'
                    +'</div>'
                    +'<div class="info-box-content tagParent">'
                    +'<div class="tagOuter">'
                    +'<div class="addSecondTag">'
                    +'<i class="fa fa-fw fa-plus"></i>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    +'</div>');
            });

            $("#save").click(function(){
                _this.saveTags();
            });

            $("#reset").click(function(){
                _this.resetTags();
            });
            window.onbeforeunload = function(){
                return "退出前请确认已经保存修改信息";
            }

        },

        saveTags:function(){
            var _this = this;
            var themes = [],tagsList = $("#tagsList .tagInfoMes");
            for(var i=0;i<tagsList.length;i++){
                var theme = {};
                var id = tagsList.eq(i).attr("data-id");
                    if(id) theme.id = id;
                theme.name = tagsList.eq(i).find(".titleSpan").html();

                theme.labelList = [];
                var labels = tagsList.eq(i).find(".tagInner");

                for(var j=0;j<labels.length;j++){
                    var label = {};
                    var labelId = labels.eq(j).attr("data-id");
                        if(labelId) label.id = labelId;
                    if(theme.id) label.themeId = theme.id;

                    label.name = labels.eq(j).find(".tabConent").html();
                    theme.labelList.push(label);
                }
                themes.push(theme);
            }
            $.showModal({
                content:"确认保存信息,保存后不可回退.",
                closeCallBack:null,
                sureCallBack:function(){
                    _this.doSave(themes);
                },
                title:"提示信息",
                closeName:"关闭",
                sureName:"确定"
            });
        },

        doSave:function(themes){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/metadata/theme/batchupdate",
                dataType:"json",
                contentType: 'application/json',
                data: JSON.stringify(themes),
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("保存成功.")
                        _this.getInfo();
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

        resetTags:function(){
            this.getInfo();
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
                    debugger;
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
                var shtml = '<div class="col-md-6">'
                        +'<div class="info-box tagInfoBox tagInfoMes"  data-id="'+dat[i].id+'">'
                            +'<div class="info-box-icon bg-aqua tagTitle">'
                            +'<div class="titleButs">'
                            +'<i class="fa fa-fw fa-arrows"></i>'
                            +'<i class="fa fa-fw fa-pencil-square-o"></i>'
                            +'<i class="fa fa-fw fa-times"></i>'
                            +'</div>'
                            +'<span class="titleSpan">'+dat[i].name+'</span>'
                        +'</div>'
                    +'<div class="info-box-content tagParent">';

                var labelList = dat[i].labelList;
                var labelHtml = '';
                for(var j=0;j<labelList.length;j++){
                    labelHtml = labelHtml +'<div class="tagOuter">'
                        +'<div class="tagInner" data-id="'+labelList[j].id+'" data-themeId="'+labelList[j].themeId+'">'
                        +'<span class="fa fa-paperclip tagIcon"></span>'
                        +'<span class="tabConent" >'+labelList[j].name+'</span>'
                        +'<span class="fa fa-fw fa-pencil-square-o tabModify"></span>'
                        +'<span class="fa fa-fw fa-times tabDelete"></span>'
                        +'</div>'
                        +'</div>';
                }
                shtml = shtml + labelHtml +'<div class="tagOuter">'
                    +'<div class="addSecondTag">'
                    +'<i class="fa fa-fw fa-plus"></i>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    +'</div>'
                    +'</div>';

                $("#tagsList").append(shtml);
            }
            $("#tagsList").append('<div class="col-md-6" class="addFirstTagCol" id="addFirstTagCol">'
                +'<div class="info-box tagInfoBox">'
                +'<div class="info-box-icon bg-aqua tagTitle">'
                +'<div class="addFirstTag">'
                +'<i class="fa fa-fw fa-plus"></i>'
                +'</div>'
                +'</div>'
                +'</div>'
                +'</div>');
        }

    };
    tagManage.init();
});
