/**
 * Created by user on 16/6/20.
 */
require(['jquery','jquery.bootstrap','jquery.datetimepicker','common','quickSearch','app'],function($){
    var hqlSearchList = {

        pageNo:1,

        pageSize:10,

        totalPage:0,

        totalRecords:0,

        init:function(){
            this.initEvent();
            this.getHqlSearchList();
        },

        initEvent:function(){
            var _this = this;

            $("#prevPage").click(function(){
                if(_this.pageNo <= 1){
                    return;
                }else{
                    _this.pageNo = _this.pageNo - 1;
                    _this.getHqlSearchList();
                }
            });

            $("#nextPage").click(function(){
                if(_this.pageNo >= _this.totalPage){
                    return;
                }
                _this.pageNo = _this.pageNo + 1;
                _this.getHqlSearchList();
            });

            $(".searchTh input").keydown(function(e){
                var e = e || window.event;
                if(e.keyCode == "13"){
                    _this.pageNo = 1;
                    _this.getHqlSearchList();
                }
            });
            $(".searchTh select").change(function(e){
                _this.pageNo = 1;
                _this.getHqlSearchList();
            });


            $("#taskTableList").delegate(".bg-orange","click",function(e){
                var ta = $(this).prev();
                if(ta.hasClass("active")){
                    ta.removeClass("active");
                }else{
                    ta.addClass("active");
                }
            });

        },


        getHqlSearchList:function(){
            var _this = this;
            showloading(true);
            $.ajax({
                type: "POST",
                url: "/sentosa/transform/dataQuery/listQueryHistory/"+_this.pageSize + "/"+_this.pageNo,
                data: {},
                success: function (result) {
                    showloading(false);
                    if(result && result.success){
                        var dat = result.pairs.pageModel;
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
                var statusStr = data[i].status==0?"":"faDisabled";
                var sHtml = '<tr>'
                    +'<td>'+new Date(data[i].execTime).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                    +'<td><textarea class="sqlListTextarea" readonly>'+data[i].content+'</textarea><button class="btn bg-orange margin" style="padding: 2px 15px;">展开</button></td>'
                    +'</tr>';
                strHtml = strHtml  + sHtml;
            }
            $("#taskTableList").html(strHtml);
        }

    };
    hqlSearchList.init();
});
