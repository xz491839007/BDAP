/**
 * Created by user on 16/6/24.
 */
/**
 * Created by user on 16/6/20.
 */
require(['jquery','d3','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($,d3){
    var taskList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        startTaskId:"",

        force:null,

        relations:null,

        json:null,

        init:function(){
            var id = $.getQueryString("id");
            if(id != null){
                $("#taskId").val(id);
            }
            this.initEvent();
            this.getTaskList();
            //this.initD3();
        },

        initEvent:function(){
            var _this = this;
            $("#addTask").click(function(){
                location.href = "taskAdd.html";
            });
            $('#createTime,#zhixingStartDate,#zhixingEndDate').datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                todayHighlight: true,
                showMeridian: true,
                minView:2,
                pickerPosition: "bottom-right",
                language: "zh-CN"
            });
            $('#zhixingStartDate').datetimepicker().on('changeDate', function(ev){
                var value = $(this).val();
                $("#zhixingEndDate").val("");
                var maxDate = new Date(new Date(value).getTime()+5*24*3600*1000).Format("yyyy-MM-dd");
                debugger;

                $("#zhixingEndDate").datetimepicker("setEndDate",maxDate);
                $("#zhixingEndDate").datetimepicker("setStartDate",value);
            });
            $("#search").click(function(){
                _this.pageNo = 1;
                _this.getTaskList();
            });
            $("#fuzeren").quickSearch({
                data:staff,
                text:"loginName",
                value:"id",
                width: "200px"
            });

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getTaskList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getTaskList();
            });

            $("#DBlistTable").delegate(".fa","click",function(){
                var $this = $(this);
                if($this.hasClass("faDisabled")){
                    return;
                }else{
                    if($this.hasClass("fa-times")){
                        $.showModal({
                            content:"是否要删除该调度,依赖此调度的任务均会执行失败.",
                            sureCallBack:function(){
                                _this.deleteTask($this.parent().attr("data-id"));
                            }
                        })
                    }else if($this.hasClass("fa-arrow-circle-up")){
                        _this.upTask($this.parent().attr("data-id"));
                    }else if($this.hasClass("fa-arrow-circle-down")){
                        _this.checkDown($this.parent().attr("data-id"),$this.parent().attr("data-taskId"),_this.downTask);
                        //_this.downTask($this.parent().attr("data-id"));
                    }else if($this.hasClass("fa-cog")){
                        location.href = "taskModify.html?id="+$this.parent().attr("data-id");
                    }else if($this.hasClass("fa-play")){
                        _this.startTaskId = $this.parent().attr("data-taskId");
                        _this.initD3(_this.startTaskId);
                        $("#taskInfoMadel").modal("toggle");
                    }
                }
            });

            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getTaskList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getTaskList();
            });

            $("#current").click(function(){
                $("#d3Div").hide();
            });
            $("#currentNext").click(function(){
                $("#d3Div").show();
            });

            $("#rodoTask").click(function(){
                _this.startTaskOpr();
            });
        },

        checkDown:function(id,taskId,fun){
            var _this = this;
            if(taskId == ""){
                taskId = _this.startTaskId;
            }
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/scheduler/check/state",
                data: {
                    ids:taskId
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        if(!result.pairs.dat || result.pairs.dat == ""){
                            fun&&fun(id,_this);
                        }else{
                            showTip("此任务正在运行,无法下线,正在运行的任务是:"+result.pairs.dat);
                        }
                    }else{
                        $.showModal({content:"操作失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        startTaskOpr:function(){
            var _this = this;
            var selectRadio = $("input[name='type']:checked").val();
            if(selectRadio == 1){
                _this.todoStartTask();
            }else{
                var nodes = this.force.nodes();
                var nodeIDs = [];
                for(var i=0;i<nodes.length;i++){
                    if(!nodes[i].statusDiable){
                        nodeIDs.push(nodes[i].id);
                    }
                }
                if(nodeIDs.length<=0){
                    showTip("节点最少选择一个");
                    return;
                }
                this.checkDown(nodeIDs.join(","),"",this.todoStartTask);
            }

        },

        todoStartTask:function(id,_this){
            //_this = !_this?this:_this;
            _this = taskList;
            var params = {};
            var zhixingStartDate = $("#zhixingStartDate").val();
            var zhixingEndDate = $("#zhixingEndDate").val();
            params.start = zhixingStartDate;
            params.end = zhixingEndDate;
            params.format = "yyyy-MM-dd";
            if(zhixingStartDate == ""){
                showTip("开始时间不能为空.");
                return;
            }
            if(zhixingEndDate == ""){
                showTip("结束时间不能为空.");
                return;
            }

            var selectRadio = $("input[name='type']:checked").val();
            if(selectRadio == 1){
                params.isFlow = "false";
            }else{
                params.isFlow = "true";
                var nodes = _this.force.nodes();
                var nodeIDs = [];
                for(var i=0;i<nodes.length;i++){
                    if(!nodes[i].statusDiable){
                        nodeIDs.push(nodes[i].id);
                    }
                }
                if(nodeIDs.length<=0){
                    showTip("节点最少选择一个");
                    return;
                }
                params.exec = nodeIDs.join(",");

            }
            $.ajax({
                type: "post",
                url: "/sentosa/job/exec/manual",
                data: {
                    id: _this.startTaskId,
                    params:JSON.stringify(params)
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("手动执行启动成功",function(){
                            location.href = "../task/taskHostoryList.html";
                        });

                    }else{
                        $.showModal({content:"手动执行失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        initD3:function(id){
            var _this = this;
            $.ajax({
                type: "get",
                url: "/sentosa/job/search/d3",
                data: {
                    id: id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var json = {"nodes": result.pairs.nodes,
                            "links": result.pairs.links
                        };
                        _this.relations = result.pairs.relations;
                        _this.createD3(json);
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

        createD3:function(json){
            var _this = this;
            d3.select("#force").select("svg").html("");
            var width = 960,
                height = 500;

            var svg = d3.select("#force").select("svg")
                .attr("width", width)
                .attr("height", height);


            var force = d3.layout.force()
                .gravity(0.1)
                .distance(200)
                .charge(-2000)
                .friction(0.1)
                .chargeDistance(100)
                .size([width, height]);

            force.nodes(json.nodes)
                .links(json.links)
                .start();
            this.force = force;
            var link = svg.selectAll(".link")
                .data(json.links)
                .enter().append("line")
                .attr("class", "link");

            var node = svg.selectAll(".node")
                .data(json.nodes)
                .enter().append("g")
                .attr("class", "node")
                .style("fill", function(d,i) {
                    if(i==0){
                        return "#312344";
                    }
                    return "rgb(23, 163, 83)";
                })
                .on("mouseover",function(d,i){
                    if(i==0){
                        return;
                    }
                    d3.select(this)
                        .style("fill","rgb(5, 89, 41)")
                        .select("text")
                        .text(function(d) { return d.englishName });
                })
                .on("mouseout",function(d,i){
                    if(i==0){
                        return;
                    }
                    if(d.statusDiable){
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .style("fill","#B60D0D");
                    }else{
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .style("fill","rgb(23, 163, 83)");
                    }

                    d3.select(this)
                        .select("text")
                        .text("");
                })
                .on("click",function(d,i){
                    if(i==0){
                        return;
                    }

                    var relations = taskList.relations;
                    var firstChilds = relations[i],childNodeIndex = [];//所有后代元素

                    while(firstChilds){
                        var children = firstChilds.split(",");
                        var nextNodeIndex = [];
                        for(var m=0;m<children.length;m++){
                            childNodeIndex.push(children[m]);
                            var rid = relations[children[m]];
                            if(rid){
                                nextNodeIndex.push(rid);
                            }
                        }
                        firstChilds = nextNodeIndex.join(",");
                    }

                    if(!d.statusDiable){
                        d.statusDiable = true;
                        d3.select(this)
                            .style("fill","#B60D0D");
                        for(var i=0;i<childNodeIndex.length;i++){
                            taskList.force.nodes()[childNodeIndex[i]].statusDiable = true;
                            d3.select(node[0][childNodeIndex[i]]).style("fill","#B60D0D");
                        }

                    }else{
                        d.statusDiable = false;
                        d3.select(this)
                            .style("fill","rgb(23, 163, 83)");
                        for(var i=0;i<childNodeIndex.length;i++){
                            taskList.force.nodes()[childNodeIndex[i]].statusDiable = false;
                            d3.select(node[0][childNodeIndex[i]]).style("fill","rgb(23, 163, 83)");
                        }
                    }

                })
                .call(force.drag);

            node.append("circle")
                .attr("x", -16)
                .attr("y", -16)
                .attr("width", 16)
                .attr("height", 16)
                .attr("r", 10);

            node.append("text")
                .attr("dx", 20)
                .attr("dy", ".35em")
                .text("");
//                .text(function(d) { return d.name });

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            });
        },

        deleteTask:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "POST",
                url: "/sentosa/scheduler/remove",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("删除成功.")
                        _this.getTaskList();
                    }else{
                        $.showModal({content:"操作失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        upTask:function(id){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/scheduler/active",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("上线成功.")
                        _this.getTaskList();
                    }else{
                        $.showModal({content:"操作失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },
        downTask:function(id,_this){
            showloading(true);
            $.ajax({
                type: "get",
                url: "/sentosa/scheduler/passive",
                data: {
                    id:id
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        showTip("下线成功.")
                        _this.getTaskList();
                    }else{
                        $.showModal({content:"操作失败"});
                    }
                },
                error:function(a,b,c){
                    showloading(false);
                    alert(a.responseText);
                }
            });
        },

        getTaskList:function(){
            var _this = this;
            var taskId = $("#taskId").val();
            var chargeUserNames = $("#chargeUserNames").val();
            var englishName = $("#englishName").val();
            var chineseName = $("#chineseName").val();
            var taskType = $("#taskType").val();
            var cronType = $("#pinci").val();
            showloading(true);
            $.ajax({
                type: "post",
                url: "/sentosa/scheduler/findPage",
                data: {
                    id: taskId,
                    chargeUserNames: chargeUserNames,
                    englishName:englishName,
                    chineseName:chineseName,
                    taskType:taskType,
                    cronType:cronType,
                    pageNo:_this.pageNo,
                    pageSize:_this.pageSize
                },
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.schedulers;
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
            this.totalPage = dat.totalPage;
            this.totalRecords = dat.totalRecords;
            $("#currentPageNum").html(this.pageNo);
            $("#totalPageNum").html(this.totalPage);
            $("#totalNum").html(this.totalRecords);
            var data = dat.results;


            var strHtml = "";
            for(var i=0;i<data.length;i++){
                var opeFa = "";
                if(data[i].active == true){
                    opeFa = '<i class="fa fa-fw fa-cog pull-left myfabut faDisabled"></i>'
                        +'<i class="fa fa-fw fa-play pull-left myfabut faDisabled"></i>'
                        +'<i class="fa fa-fw fa-arrow-circle-up pull-left myfabut faDisabled"></i>'
                        +'<i class="fa fa-fw fa-arrow-circle-down pull-left myfabut"></i>'
                        +'<i class="fa fa-fw fa-times pull-left myfabut faDisabled"></i>';
                }else{
                    opeFa = '<i class="fa fa-fw fa-cog pull-left myfabut"></i>'
                        +'<i class="fa fa-fw fa-play pull-left myfabut"></i>'
                        +'<i class="fa fa-fw fa-arrow-circle-up pull-left myfabut"></i>'
                        +'<i class="fa fa-fw fa-arrow-circle-down pull-left myfabut faDisabled"></i>'
                        +'<i class="fa fa-fw fa-times pull-left myfabut"></i>';
                }
                var sHtml = '<tr>'
                    +'<td title="'+data[i].id+'">'+data[i].id+'</td>'
                    +'<td title="'+data[i].englishName+'">'+data[i].englishName+'</td>'
                    +'<td title="'+data[i].chineseName+'">'+data[i].chineseName+'</td>'
                    +'<td title="'+data[i].taskName+'">'+data[i].taskName+'</td>'
                    +'<td title="'+this.getTaskType(data[i].taskType)+'">'+this.getTaskType(data[i].taskType)+'</td>'
                    +'<td title="'+(!data[i].dependent?"":data[i].dependent)+'">'+(!data[i].dependent?"":data[i].dependent)+'</td>'
                    +'<td title="'+(!data[i].dependented?"":data[i].dependented)+'">'+(!data[i].dependented?"":data[i].dependented)+'</td>'
                    +'<td title="'+(new Date(data[i].startExecTime)).Format("yyyy-MM-dd hh:mm:ss").split(" ")[1]+'">'+(new Date(data[i].startExecTime)).Format("yyyy-MM-dd hh:mm:ss").split(" ")[1]+'</td>'
                    +'<td title="'+this.getCronType(data[i].cronType)+'">'+this.getCronType(data[i].cronType)+'</td>'
                    +'<td title="'+data[i].chargeUserNames+'">'+data[i].chargeUserNames+'</td>'
                    +'<td data-id="'+data[i].id+'" style="width:120px;" data-taskId="'+data[i].taskId+'">'
                    + opeFa
                    +'</td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#DBlistTable").html(strHtml);
        },

        getTaskType:function(type){
            if(type == 1){
                return "SQOOP抽取";
            }else if(type == 2){
                return "SQOOP导出";
            }else if(type == 3){
                return "HiveSQL";
            }
            return "";
        },
        getCronType:function(type){
            if(type == 1){
                return "秒";
            }else if(type == 2){
                return "分钟";
            }else if(type == 3){
                return "小时";
            }else if(type == 4){
                return "天";
            }else if(type == 6){
                return "月";
            }else if(type == 5){
                return "周";
            }else if(type == 7){
                return "年";
            }
            return "";
        }

    };
    taskList.init();
});
