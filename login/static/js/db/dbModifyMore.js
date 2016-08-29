/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var dbAddMore = {

        groupId:"",

        obj:null,

        init:function(){
            this.initEvent();
            this.groupId = $.getQueryString("groupId");
            this.getInfo();
        },

        initEvent:function(){
            var _this = this;
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

            $(".myoprku .fa").click(function(){
                var type = $(this).attr("data-type");
                var selectRadio = $("input[name='optionsRadios']:checked");
                if(selectRadio.length == 0 && type != "add"){
                    $.showModal({
                        content:"请先在选择一个字段",
                        title:"提示信息"
                    });
                    return;
                }

                var $tr = selectRadio.parents("tr");
                if(type=="add"){
                    var strHtml = '<tr>'
                        +'<td>'
                        +'<div class="radio">'
                        +'<label>'
                        +'<input type="radio" name="optionsRadios" value="1">'
                        +'</label>'
                        +'</div>'
                        +'</td>'
                        +'<td>'
                        +'<div class="input-group-sm">'
                        +'<input type="text" class="form-control" placeholder="">'
                        +'</div>'
                        +'</td>'
                        +'<td>'
                        +'<div class="input-group-sm">'
                        +'<input type="text" class="form-control" placeholder="">'
                        +'</div>'
                        +'</td>'
                        +'<td>'
                        +'<div class="input-group-sm">'
                        +'<input type="text" class="form-control" placeholder="">'
                        +'</div>'
                        +'</td>'
                        +'<td>'
                        +'<div class="input-group-sm">'
                        +'<input type="text" class="form-control" placeholder="">'
                        +'</div>'
                        +'</td>'
                        +'<td>'
                        +'<div class="input-group-sm">'
                        +'<input type="text" class="form-control" placeholder="">'
                        +'</div>'
                        +'</td>'
                        +'</tr>';
                    if(selectRadio.length == 0){
                        $("#duokuxinxi").append(strHtml);
                    }else{
                        $tr.after(strHtml);
                    }

                }else if(type=="del"){
                    if($("#duokuxinxi tr").length>1){
                        $tr.remove();
                    }
                }else if(type=="up"){
                    if ($tr.index() != 0) {
                        $tr.prev().before($tr);
                    }
                }else if(type=="down"){
                    var $tr = $(selectRadio).parents("tr");
                    if ($tr.next().length>0) {
                        $tr.next().after($tr);
                    }
                }
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
            $("#qudongType").val(_this.obj.dbList[0].driverType);
            if(_this.obj.dbList[0].driverType == "oracle"){
                $(".oracleUse").show();
                $("#select_username").val(this.obj.dbList[0].selectUserName);
            }
            $("#desc").val(_this.obj.note);

            var dbList = _this.obj.dbList;
            for(var i=0;i<dbList.length;i++){
                var strHtml = '<tr data-dbid="'+dbList[i].id+'">'
                    +'<td>'
                    +'<div class="radio">'
                    +'<label>'
                    +'<input type="radio" name="optionsRadios" value="1">'
                    +'</label>'
                    +'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control" placeholder="" value="'+dbList[i].host+'">'
                    +'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control" placeholder="" value="'+dbList[i].name+'">'
                    +'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control" placeholder="" value="'+dbList[i].port+'">'
                    +'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control" placeholder="" value="'+dbList[i].userName+'">'
                    +'</div>'
                    +'</td>'
                    +'<td>'
                    +'<div class="input-group-sm">'
                    +'<input type="text" class="form-control" placeholder="" value="'+dbList[i].password+'">'
                    +'</div>'
                    +'</td>'
                    +'</tr>';
                $("#duokuxinxi").append(strHtml);
            }


        },

        saveKu:function(){
            var _this = this;
            var verifyFlag = verifyEmpty(
                [
                    {name:"dbjiancheng",label:"DB简介"},
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
                var  duokuxinxi = $("#duokuxinxi tr");
                var dbList = [];
                for(var i=0;i<duokuxinxi.length;i++){

                    var inputs = duokuxinxi.eq(i).find("input[type=text]");
                    var elm = {};
                    var dbid = duokuxinxi.eq(i).attr("data-dbid");
                    if(dbid != ""){
                        elm.id = dbid;
                    }
                    if(inputs.eq(0).val() != ""){
                        elm.host = inputs.eq(0).val();
                    }else{
                        inputs.eq(0).focus();
                        showTip("第"+(i+1)+"行HOST不能为空.");
                        return;
                    }
                    if(inputs.eq(1).val() != ""){
                        elm.name = inputs.eq(1).val();
                    }else{
                        inputs.eq(1).focus();
                        showTip("第"+(i+1)+"行database不能为空.");
                        return;
                    }
                    if(inputs.eq(2).val() != ""){
                        elm.port = inputs.eq(2).val();
                    }else{
                        inputs.eq(2).focus();
                        showTip("第"+(i+1)+"行POST不能为空.");
                        return;
                    }
                    if(inputs.eq(3).val() != ""){
                        elm.userName = inputs.eq(3).val();
                    }else{
                        inputs.eq(3).focus();
                        showTip("第"+(i+1)+"行userName不能为空.");
                        return;
                    }
                    if(inputs.eq(4).val() != ""){
                        elm.password = inputs.eq(4).val();
                    }else{
                        inputs.eq(4).focus();
                        showTip("第"+(i+1)+"行password不能为空.");
                        return;
                    }
                    elm.driverType = $("#qudongType").val();
                    elm.selectUserName = $("#select_username").val();
                    elm.creator = "dbAddOne测试用户";
                    dbList.push(elm);
                }
                _this.obj.name = $("#dbjiancheng").val();
                _this.obj.note = $("#desc").val();
                _this.obj.dbList = dbList;

                $.ajax({
                    type: "post",
                    url: "/sentosa/metadata/group/modify",
                    dataType:"json",
                    contentType: 'application/json',
                    data: JSON.stringify(_this.obj),
                    success: function (result) {
                        showloading(false);
                        if(result && result.success){
                            showTip("保存成功!");
                            location.href = "dbList.html";
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

    }
    dbAddMore.init();
});
