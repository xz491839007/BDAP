/**
 * Created by user on 16/6/24.
 */
/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($,d3){
    var addRule = {

        _EXPR: "CG",

        _LABELEXPR:"C",

        selectMeijuInput:null,

        quickTimeOut:null,

        operweiduTagValues:[],

        _moveElm:null,

        move:false,

        _ableMove:"",

        toDraggableDiv:null,

        formDraggableDiv:null,

        init:function(){
            this.initEvent();
            this.getTagList();
        },

        initEvent:function() {
            var _this = this;

            $(".labelGroups").delegate("li a","click",function(){
                var li = $(this).parent();
                if(li.hasClass("active")){
                    return;
                }
                li.addClass("active");
                _this.addTypeList(li);
            });
            $(".labelGroups").delegate("li a i","click",function(e){
                var lii = $(this).parent().parent();
                lii.removeClass("active");
                _this.removeTypeList(lii);
                e.stopPropagation();
                e.preventDefault();
            });

            $(".more").click(function(){
                if($(this).find("i").hasClass("fa-plus")){
                    $(this).siblings(".tagValues").addClass("jielue");
                    $(this).find(".fa-fw").removeClass("fa-plus").addClass("fa-minus");
                }else{
                    $(this).siblings(".tagValues").removeClass("jielue");
                    $(this).find(".fa-fw").removeClass("fa-minus").addClass("fa-plus");
                }
            });

            $(".luojiDiv .fa-times-circle").click(function(){
                var a = $(this).parent();
                a.fadeOut(300,function(){
                    a.remove();
                })
            });

            $(".luojiDiv .cont").delegate("a","click",function(){
                if($(this).hasClass("active")){
                    $(this).removeClass("active");
                }else{
                    $(this).addClass("active");
                }
            });

            //$(".opreFas .fa-arrow-circle-right").click(function(){
            //    var actives = $("#jiaojiElm a.active");
            //    $("#bingjiElm").append(actives);
            //});
            //$(".opreFas .fa-arrow-circle-left").click(function(){
            //    var actives = $("#bingjiElm a.active");
            //    $("#jiaojiElm").append(actives);
            //});

            //枚举值选择处理
            $("#weiduTable").delegate(".meijuValues","click",function(){
                _this.selectMeijuInput = $(this);
                var values = $(this).val().split(","),id = $(this).attr("data-id");
                $(".selectUsers").html("");
                if(values != ""){
                    for(var i=0;i<values.length;i++){
                        $(".selectUsers").append('<a class="btn btn-app" data-value="'+$.trim(values[i])+'">'
                            +'<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                            +values[i]
                            +'</a>');
                    }
                }
                _this.getValuesByTagId(id);
            });

            $(".selectUsers").delegate('.badge', "click", function () {
                $(this).parent().remove();
            });

            $(".myuserUl").delegate("li",'click',function(){
                var value = $(this).attr("data-value");
                if ($(".selectUsers").find("a[data-value='" + value + "']").length <= 0) {
                    $(".selectUsers").append('<a class="btn btn-app" data-value="' + value + '">'
                        + '<span class="badge bg-yellow"><i class="fa fa-fw fa-times"></i></span>'
                        + value
                        + '</a>');
                }
            });
            $("#quickSearchValue").keyup(function (e) {
                var e = e || window.event;
                var value = $(this).val();
                if (e.keyCode != 38 && e.keyCode != 40) {
                    _this.quickTimeOut = setTimeout(function () {
                        _this.quickSearchValues(value);
                    }, 500)
                }
            });
            $("#quickSearchValue").keydown(function (e) {
                clearTimeout(_this.quickTimeOut);
            });

            $("#addMeijuValue").click(function(){
                _this.setWeiduInput();
            });

            $("#jingtaitable,#dongtaizhibiao").delegate(".guanxiselect select","change",function(){
                var value = $(this).val();
                if(value == "between"){
                    $(this).parent().next().find("input").eq(1).show();
                }else{
                    $(this).parent().next().find("input").eq(1).hide();
                }
            });

            $("#jingtaitable,#dongtaizhibiao").delegate(".rulesureAdd","click",function(){
                var select = $(this).parent().prev().prev().find("select");
                var inputs = $(this).parent().prev().find("input");
                if(select.val() == "between"){
                    if($.trim(inputs.eq(0).val()) == ""){
                        inputs.eq(0).focus();
                        showTip("值不能为空.");
                        return;
                    }
                    if($.trim(inputs.eq(1).val()) == ""){
                        inputs.eq(1).focus();
                        showTip("值不能为空.");
                        return;
                    }
                    var valuesTd = $(this).parent().parent().find(".valuesTd");
                    var or = "";
                    if(valuesTd.find("a").length > 0){
                        or = "<span class='guanxiLabel'> or </span>";
                    }
                    valuesTd.append(or + '<a class="elmTagA">'
                        +'between ' + inputs.eq(0).val() + ' and ' + inputs.eq(1).val()
                        +'<i class="fa fa-fw fa-times-circle"></i>'
                        +'</a>');
                }else{
                    if($.trim(inputs.eq(0).val()) == ""){
                        inputs.eq(0).focus();
                        showTip("值不能为空.");
                        return;
                    }
                    var valuesTd = $(this).parent().parent().find(".valuesTd");
                    var or = "";
                    if(valuesTd.find("a").length > 0){
                        or = "<span class='guanxiLabel'> or </span>";
                    }
                    valuesTd.append(or + '<a class="elmTagA">'
                        + select.val() + " " + inputs.eq(0).val()
                        +'<i class="fa fa-fw fa-times-circle"></i>'
                        +'</a>');
                }
            });

            $(".dingzhitable").delegate(".elmTagA .fa-times-circle","click",function(){
                var prevSpan = $(this).parent().prev("span");
                var nextSpan = $(this).parent().next("span");
                if(prevSpan.length == 0 &&  nextSpan.length == 0){
                }else if(prevSpan.length == 1 &&  nextSpan.length == 0){
                    prevSpan.remove();
                }else if(prevSpan.length == 0 &&  nextSpan.length == 1){
                    nextSpan.remove();
                }else if(prevSpan.length == 1 &&  nextSpan.length == 1){
                    prevSpan.remove();
                }
                $(this).parent().remove();
            });


            //标签逻辑拖拽
            $(".tagLuoji").delegate(".draggable", "mouseenter", function (e) {
                _this._ableMove = true;
                _this.toDraggableDiv = $(this);
            });
            $(".tagLuoji").delegate(".draggable", "mouseleave", function (e) {
                _this._ableMove = false;
            });
            $(".tagLuoji").delegate(".draggable a", "mousedown", function (e) {
                _this.move = true;
                _this.formDraggableDiv = $(this).parent();
                _this._moveElm = $(this);
                $("#dragSpan").html($(this).text());
                var x = e.clientX;//控件左上角到屏幕左上角的相对位置
                var y = e.clientY;
                var wekitType = _this.myBrowser();
                if (wekitType == "Chrome") {
                    $(".drag").css({"top": y+5, "left": x+5});
                } else if (wekitType == "Safari") {
                    $(".drag").css({"top": y, "left": x});
                } else {
                    $(".drag").css({"top": y, "left": x});
                }

                $(".drag").show();
            });
            $(document).mousemove(function (e) {
                if (_this.move) {
                    var x = e.clientX;//控件左上角到屏幕左上角的相对位置
                    var y = e.clientY;
                    var wekitType = _this.myBrowser();
                    if (wekitType == "Chrome") {
                        $(".drag").css({"top": y+5, "left": x+5});
                    } else if (wekitType == "Safari") {
                        $(".drag").css({"top": y+5, "left": x+5});
                    } else {
                        $(".drag").css({"top": y, "left": x});
                    }
                }
            }).mouseup(function () {
                $(".drag").hide();
                if (_this._ableMove && _this.move) {
                    _this.toDraggableDiv.append('<a data-id="'+_this._moveElm.attr("data-id")+'">'+_this._moveElm.text()+'</a>');
                    _this._moveElm.remove();
                }
                _this.move = false;
            });


            $(".tagLuoji").delegate(".fa-times","click",function(){
                var parent = $(this).parent().parent();
                parent.prev().remove();
                $("#allTagsDraggagle").append(parent.find(".draggable").html());
                parent.remove();
            });

            $(".addNewGroup").click(function(){
                $(this).parent().before('<div class="guanxi">'
                    +'<select class="myselect100">'
                    +'<option value="or">or</option>'
                    +'<option value="and">and</option>'
                    +'</select>'
                    +'</div>'
                    +'<div class="luojiDiv luojiLeft">'
                    +'<div class="tit">'
                    +'<select class="myselect100" style="width:100px;">'
                    +'<option value="or">or</option>'
                    +'<option value="and">and</option>'
                    +'</select>'
                    +'<i class="fa fa-fw fa-times"></i>'
                    +'</div>'
                    +'<div class="cont draggable">'
                    +'</div>'
                    +'</div>');
            });

            $("#add").click(function(){
                _this.saveRule();
            });

        },

        saveRule:function(){
            var _this = this;
            var rule = {};
            var name = $.trim($("#ruleName").val());
            if(name == ""){
                showTip("任务名称不能为空");
                return;
            }
            rule.name = name;

            var uuid = $('input:radio[name="uuid"]:checked').val();
            rule.uuid = uuid;

            rule.period = $('input:radio[name="period"]:checked').val();;

            var label_list = [],labellis = $(".tagValues").find('li.active');
            if(labellis.length<=0){
                showTip("请选择最少一个标签.");
                return;
            }
            for(var i=0;i<labellis.length;i++){
                label_list.push(labellis.eq(i).attr("data-id"));
            }
            rule.label_list = label_list.join(",");


            //所有标签的值list
            var labelValuesList =[], weidutrs = $("#weiduTable tr"),
                jingtaitrs = $("#jingtaitable tr"),
                dongtaitrs = $("#dongtaizhibiao tr");
            for(var j=0;j<weidutrs.length;j++){
                var obj = {},tr = weidutrs.eq(j),tds = tr.find("td");
                obj.label_id = tr.attr("data-id");
                obj.label_name = tr.attr("data-name");
                obj.type = 1;
                obj.values = tr.find("input").val();
                if($.trim(obj.values) == ""){
                    showTip("维度 "+obj.label_name+" 值不能为空.");
                    return;
                }
                obj.start_time = "";
                obj.end_time = "";
                labelValuesList.push(obj);
            }
            for(var k=0;k<jingtaitrs.length;k++){
                var obj = {},tr = jingtaitrs.eq(k),tds = tr.find("td");
                obj.label_id = tr.attr("data-id");
                obj.label_name = tr.attr("data-name");
                obj.type = 2;
                var values = tds.eq(2).text();
                if($.trim(values) == ""){
                    showTip("静态指标 "+obj.label_name+" 值不能为空.");
                    return;
                }
                obj.values = values.split("or").join(",");
                obj.start_time = "";
                obj.end_time = "";

                labelValuesList.push(obj);
            }
            for(var k=0;k<dongtaitrs.length;k++){
                var obj = {},tr = dongtaitrs.eq(k),tds = tr.find("td");
                obj.label_id = tr.attr("data-id");
                obj.label_name = tr.attr("data-name");
                obj.type = 2;
                var values = tds.eq(3).text();
                if($.trim(values) == ""){
                    showTip("动态指标 "+obj.label_name+" 值不能为空.");
                    return;
                }
                obj.values = values.split("or").join(",");
                obj.start_time = tds.eq(2).find("input").eq(0).val();
                obj.end_time = tds.eq(2).find("input").eq(1).val();
                if($.trim(obj.start_time) == ""){
                    showTip("动态指标 "+obj.label_name+" 起始时间不能为空.");
                    return;
                }
                if($.trim(obj.end_time) == ""){
                    showTip("动态指标 "+obj.label_name+" 结束时间不能为空.");
                    return;
                }

                labelValuesList.push(obj);
            }

            //逻辑C1 AND C2 OR C3 OR C4
            var luojiLefts = $(".luojiLeft"),expr = "";
            for(var m=0;m<luojiLefts.length;m++){
                if(m != 0){
                    expr = expr + " " + luojiLefts.eq(m).prev().find("select").val() + " ";
                }
                expr = expr + " " + this._EXPR + m + " ";

                var pobj = {},children = luojiLefts.eq(m).find(".draggable a"),labels = [];
                pobj.type = luojiLefts.find("select").val();
                for(var n=0;n<children.length;n++){
                    pobj[this._LABELEXPR + n] = this.getTagById(children.eq(n).attr("data-id"),labelValuesList);
                    labels.push(this._LABELEXPR + n);
                }
                pobj.expr = labels.join(" " + pobj.type + " ");
                rule[this._EXPR  + m] = pobj;
            }

            rule.desc = $("#desc").val();

            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/usergroup/group/add",
                data: rule,
                success: function (result) {
                    showloading(false);
                    if (result && result.success) {
                        showTip("保存成功!");
                        location.href = "ruleList.html";
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

        getTagById:function(id,arr){
            for(var i=0;i<arr.length;i++){
                if(id == arr[i].label_id){
                    return arr[i];
                }
            }
            return;
        },

        quickSearchValues:function(value){
            $(".myuserUl").html("");
            var values = this.operweiduTagValues;
            for(var i=0;i<values.length;i++){
                if(values[i].indexOf(value)>-1){
                    $(".myuserUl").append('<li data-value="'+values[i]+'"><a href="javascript:void(0);">'+values[i]+'</a></li>');
                }
            }

        },

        setWeiduInput:function(){
            var selectUsers = $(".selectUsers a");
            var valuess = [];
            for (var i = 0; i < selectUsers.length; i++) {
                valuess.push(selectUsers.eq(i).attr("data-value"));
            }
            this.selectMeijuInput.val(valuess.join(", "));
            $("#tagModal").modal("hide");
        },

        addTypeList:function($li){
            var id = $li.attr("data-id"),type = $li.attr("data-type"),name = $li.attr("data-name");
            if(type == 1){
                var weiduTable = $("#weiduTable");
                var strHtml = '<tr data-id="'+id+'" data-name="'+name+'">'
                    +'<td style="width:50px;">'
                    + (weiduTable.find("tr").length + 1)
                    +'</td>'
                    +'<td style="width:100px;">'
                    + name
                    +'</td>'
                    +'<td style="width:100px;">'
                    +'<select class="myselect100">'
                    +'<option value="=">等于</option>'
                    +'<option value="<>">不等于</option>'
                    +'<option value="in">in</option>'
                    +'<option value="not in">not in</option>'
                    +'</select>'
                    +'</td>'
                    +'<td style="width:650px;">'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control meijuValues" data-id="'+id+'" placeholder="点击添加枚举值" readonly>'
                    +'</div>'
                    +'</td>'
                    +'</tr>';
                weiduTable.append(strHtml);
                showTip("已将标签"+name+"添加到维度.");
            }else if(type == 2){
                var jingtaitable = $("#jingtaitable");
                var strHtml = '<tr data-id="'+id+'" data-name="'+name+'">'
                    +'<td style="width:50px;">'
                    + (jingtaitable.find("tr").length + 1)
                    +'</td>'
                    +'<td  style="width:100px;">'
                    + name
                    +'</td>'
                    +'<td style="width:600px;" class="valuesTd">'
                    +'</td>'
                    +'<td class="guanxiselect" style="width:100px;">'
                    +'<select class="myselect100">'
                    +'<option value="=">=</option>'
                    +'<option value=">"> > </option>'
                    +'<option value="<"> < </option>'
                    +'<option value=">=">>=</option>'
                    +'<option value="<="><=</option>'
                    +'<option value="between">between</option>'
                    +'</select>'
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control jingduinput" placeholder="">'
                    +'<input type="text" class="form-control jingduinput" placeholder="" style="display:none;">'
                    +'</div>'
                    +'</td>'
                    +'<td style="width:50px;">'
                    +'<a class="rulesureAdd">确定</a>'
                    +'</td>'
                    +'</tr>';
                jingtaitable.append(strHtml);
                showTip("已将标签"+name+"添加到静态指标.");
            }else if(type == 3){
                var dongtaizhibiao = $("#dongtaizhibiao");
                var strHtml = '<tr data-id="'+id+'" data-name="'+name+'">'
                    +'<td style="width:50px;">'
                    + (dongtaizhibiao.find("tr").length + 1)
                    +'</td>'
                    +'<td  style="width:100px;">'
                    + name
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control dongtaiTime" placeholder="起始时间" >'
                    +'<input type="text" class="form-control dongtaiTime" placeholder="结束时间" >'
                    +'</div>'
                    +'</td>'
                    +'<td style="width:300px;" class="valuesTd">'
                    +'</td>'
                    +'<td class="guanxiselect" style="width:100px;">'
                    +'<select class="myselect100">'
                    +'<option value="=">=</option>'
                    +'<option value=">"> > </option>'
                    +'<option value="<"> < </option>'
                    +'<option value=">=">>=</option>'
                    +'<option value="<="><=</option>'
                    +'<option value="between">between</option>'
                    +'</select>'
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control jingduinput" placeholder="">'
                    +'<input type="text" class="form-control jingduinput" placeholder="" style="display:none;">'
                    +'</div>'
                    +'</td>'
                    +'<td style="width:50px;">'
                    +'<a class="rulesureAdd">确定</a>'
                    +'</td>'
                    +'</tr>';
                dongtaizhibiao.append(strHtml);
                showTip("已将标签"+name+"添加到静态指标.");
                $(".dongtaiTime").datetimepicker({
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    todayBtn: true,
                    todayHighlight: true,
                    showMeridian: true,
                    minView:2,
                    pickerPosition: "bottom-right",
                    language: "zh-CN"
                });
            }
            $("#allTagsDraggagle").append('<a data-id="'+id+'">'+name+'</a>');
            $(".jingduinput").numeral();
        },

        removeTypeList:function($li){
            var id = $li.attr("data-id"),type = $li.attr("data-type"),name = $li.attr("data-name");
            if(type == 1){
                $("#weiduTable tr[data-id="+id+"]").remove();
                var trs = $("#weiduTable tr");
                for(var i=0;i<trs.length;i++){
                    trs.eq(i).find("td").eq(0).html(i+1);
                }
                showTip("已将标签"+name+"从维度中删除.");
            }else if(type == 2) {
                $("#jingtaitable tr[data-id="+id+"]").remove();
                var trs = $("#jingtaitable tr");
                for(var i=0;i<trs.length;i++){
                    trs.eq(i).find("td").eq(0).html(i+1);
                }
                showTip("已将标签"+name+"从静态指标中删除.");
            }else if(type == 3) {
                $("#dongtaizhibiao tr[data-id="+id+"]").remove();
                var trs = $("#dongtaizhibiao tr");
                for(var i=0;i<trs.length;i++){
                    trs.eq(i).find("td").eq(0).html(i+1);
                }
                showTip("已将标签"+name+"从动态指标中删除.");
            }
            $(".draggable a[data-id="+id+"]").remove();
        },

        getValuesByTagId:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/usergroup/label/getvalues",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        if(dat == ""){
                            showTip("该标签没有枚举值,请检查.");
                            return;
                        }else{
                            $(".myuserUl").html("");
                            var values = dat.split(",");
                            _this.operweiduTagValues = values;
                            for(var i=0;i<values.length;i++){
                                $(".myuserUl").append('<li data-value="'+values[i]+'"><a href="javascript:void(0);">'+values[i]+'</a></li>');
                            }
                            $("#tagModal").modal("toggle");
                        }
                    }else{
                        $.showModal({content:"查询失败:"+result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getTagList:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/usergroup/label/list/all",
                data: {
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.dat;
                        _this.setDataList(dat);
                    }else{
                        $.showModal({content:"查询失败:"+result.message});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        setDataList:function(dat){
            for(var i=0;i<dat.length;i++){
                var obj = dat[i];
                var strHtml = '<li data-id="'+obj.id+'" data-type="'+obj.type+'" data-name="'+obj.name+'">'
                    +'<a>'
                    +obj.name
                    +'<i class="fa fa-fw fa-times-circle"></i>'
                    +'</a>'
                    +'</li>';
                $("#classification_"+ obj.classification).append(strHtml);
            }
        },

        myBrowser: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            }
            ; //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }
            ; //判断是否IE浏览器
        }

    };
    addRule.init();
});
