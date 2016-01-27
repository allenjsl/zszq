define(function(require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var _userid = 0;
    var _custid = 0;
    $(function() {
        init();
    })

    function init() {
        //_custid = 10100000007;
    	oTools.readMapMesg(['userid', 'custid', 'username', 'mobileno'], function(oData) {
    		_userid = oData.USERID;
    		if(oData.CUSTID !=null && oData.CUSTID != undefined && oData.CUSTID !="")
    		{
    		_custid = oData.CUSTID;
    		Charts.RiQi();
    		Charts.InitData();
    		Charts.CheckData();
    		pageEvent();
    		$("#tubiao").show();
    		}
    		else
    		{
    		
    		GetTouXiang();
    		}
    	});
    }
    function pageEvent() {
        GetTouXiang();
        GetStyle(_custid);
        GetAssetAllocation(_custid);
        GetIndustryPosition(_custid);
        GetTradingFrequency(_custid);
        GetRotationRate(_custid);
        GetTrend(_custid);
    }
    //获取头像
	function GetTouXiang() {
		var _oSend = {
			action: 31004,
			merid: "applogin",
			bizcode: "account.myicon",
			timestamp: TZT.TAG,//"2014-12-02 15:12:00",
			req_id: Math.random(),
			v: 1.0,//1,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: '{"userid":"'+_userid+'","type":"get","base64_icon":"null"}'
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if(!oData.BINDATA.data) {
				return;
			}
			if (oData.BINDATA.data.dataset.url.length>0) {
				$('.touxiang').attr('src', oData.BINDATA.data.dataset.url);
			}
		});
	}
    //获取个人投资风格
    function GetStyle(_custid) {
    var _oSend = {
            action: 31008,
            merid: "applogin",
            bizcode: "account.investmentstyle",
            timestamp: TZT.TAG, //"2014-12-02 15:12:00",
            req_id: Math.random(),
            v: 1.0, //1,
            charset: "utf-8",
            sign_type: "rsa",
            format: "json",
            data: '{"custid":"'+_custid+'"}'
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.FengGe(oData);
        });
        //Charts.FengGe();
    };
    //获取客户资产配置
    function GetAssetAllocation(_custid) {
        var _oSend = {
            action: 31008,
            merid: "applogin",
            bizcode: "account.asset.allocation",
            timestamp: TZT.TAG, //"2014-12-02 15:12:00",
            req_id: Math.random(),
            v: 1.0, //1,
            charset: "utf-8",
            sign_type: "rsa",
            format: "json",
            data: '{"custid":"'+_custid+'"}'
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.PeiZhi(oData);
        });
        //Charts.PeiZhi();
    };
    //获取客户行业持仓
    function GetIndustryPosition(_custid) {
        var _oSend = {
            action: 31008,
            merid: "applogin",
            bizcode: "account.position.industry",
            timestamp: TZT.TAG, //"2014-12-02 15:12:00",
            req_id: Math.random(),
            v: 1.0, //1,
            charset: "utf-8",
            sign_type: "rsa",
            format: "json",
            data: '{"custid":"'+_custid+'"}'
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.HangYe(oData);
        });
        //Charts.HangYe();
    };
    //获取客户交易频度
    function GetTradingFrequency(_custid) {
    
    var _oSend = {
            action: 31008,
            merid: "applogin",
            bizcode: "account.trade.frequent",
            timestamp: TZT.TAG, //"2014-12-02 15:12:00",
            req_id: Math.random(),
            v: 1.0, //1,
            charset: "utf-8",
            sign_type: "rsa",
            format: "json",
            data: '{"custid":"'+_custid+'","startDate":"'+new Date($("#PDStartTime").val()).Format("yyyyMM")+'","endDate":"'+new Date($("#PDEndTime").val()).Format("yyyyMM")+'"}'
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.PingDu(oData);
        });
        //Charts.PingDu();
    };
    //获取客户资产周转率
    function GetRotationRate(_custid) {
    var _oSend = {
            action: 31008,
            merid: "applogin",
            bizcode: "account.asset.turnover",
            timestamp: TZT.TAG, //"2014-12-02 15:12:00",
            req_id: Math.random(),
            v: 1.0, //1,
            charset: "utf-8",
            sign_type: "rsa",
            format: "json",
            data: '{"custid":"'+_custid+'","startDate":"'+new Date($("#ZZStartTime").val()).Format("yyyyMM")+'","endDate":"'+new Date($("#ZZEndTime").val()).Format("yyyyMM")+'"}'
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.ZhouZhuan(oData);
        });
        //Charts.ZhouZhuan();
    };
    //获取净值走势
    function GetTrend(_custid) {
    var hData;
    var mData;
    var _oSend = {
            action: 31008,
            merid: "applogin",
            bizcode: "account.hs300.number",
            timestamp: TZT.TAG, //"2014-12-02 15:12:00",
            req_id: Math.random(),
            v: 1.0, //1,
            charset: "utf-8",
            sign_type: "rsa",
            format: "json",
            data: '{"startDate":"'+new Date($("#JZStartTime").val()).Format("yyyyMMdd")+'","endDate":"'+new Date($("#JZEndTime").val()).Format("yyyyMMdd")+'"}'
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            hData = oData;
            var _oSend1 = {
            action: 31008,
            merid: "applogin",
            bizcode: "account.total.assbal",
            timestamp: TZT.TAG, //"2014-12-02 15:12:00",
            req_id: Math.random(),
            v: 1.0, //1,
            charset: "utf-8",
            sign_type: "rsa",
            format: "json",
            data: '{"custid":"'+_custid+'","startDate":"'+new Date($("#JZStartTime").val()).Format("yyyyMMdd")+'","endDate":"'+new Date($("#JZEndTime").val()).Format("yyyyMMdd")+'"}'
        };
        TZT.getData(TZT.REQ.XML, _oSend1, function(oData) {
            mData = oData;
            Charts.ZouShi(hData,mData);
        });
        });
        
        
    };
});
var Charts = {
    InitData: function(){
            var now = new Date(); 
            var tnow  = new Date();
            tnow.setDate(tnow.getDate()-1); 
            var nowStr = now.Format("yyyy-MM");
            $("#PDEndTime").val(nowStr); 
            $("#ZZEndTime").val(nowStr);
            $("#JZEndTime").val(tnow.Format("yyyy-MM-dd"));
            now.setMonth(now.getMonth()-5); 
            tnow.setDate(tnow.getDate()-20); 
            nowStr = now.Format("yyyy-MM");
            $("#PDStartTime").val(nowStr);
            $("#ZZStartTime").val(nowStr);
            $("#JZStartTime").val(tnow.Format("yyyy-MM-dd"));
    },
    CheckData: function(){
    //交易频度结束时间
    $("#PDEndTime").change(function(){
       var pdend = new Date($("#PDEndTime").val()).Format("yyyy-MM");
       $("#PDEndTime").val(pdend);
       var pdstart = new Date($("#PDStartTime").val()).Format("yyyy-MM");
       if(new Date(pdstart)>=new Date(pdend))
       {
            pdstart = new Date(pdstart).setMonth(new Date(pdend).getMonth()-1); 
            pdstart = new Date(pdstart).Format("yyyy-MM");
            $("#PDStartTime").val(pdstart);
       }
       GetTradingFrequency(_custid);
    });
    //交易频度开始时间
    $("#PDStartTime").change(function(){
       var pdend = new Date($("#PDEndTime").val()).Format("yyyy-MM");
       var pdstart = new Date($("#PDStartTime").val()).Format("yyyy-MM");
       $("#PDStartTime").val(pdstart);
       if(new Date(pdstart)>=new Date(pdend))
       {
            pdstart = new Date(pdstart).setMonth(new Date(pdend).getMonth()-1); 
            pdstart = new Date(pdstart).Format("yyyy-MM");
            $("#PDStartTime").val(pdstart);
       }
       GetTradingFrequency(_custid);
    });
    //周转率结束时间
    $("#ZZEndTime").change(function(){
       var pdend = new Date($("#ZZEndTime").val()).Format("yyyy-MM");
       $("#ZZEndTime").val(pdend);
       var pdstart = new Date($("#ZZStartTime").val()).Format("yyyy-MM");
       if(new Date(pdstart)>=new Date(pdend))
       {
            pdstart = new Date(pdstart).setMonth(new Date(pdend).getMonth()-1); 
            pdstart = new Date(pdstart).Format("yyyy-MM");
            $("#ZZStartTime").val(pdstart);
       }
       GetRotationRate(_custid);
    });
    //周转率开始时间
    $("#ZZStartTime").change(function(){
       var pdend = new Date($("#ZZEndTime").val()).Format("yyyy-MM");
       var pdstart = new Date($("#ZZStartTime").val()).Format("yyyy-MM");
       $("#ZZStartTime").val(pdstart);
       if(new Date(pdstart)>=new Date(pdend))
       {
            pdstart = new Date(pdstart).setMonth(new Date(pdend).getMonth()-1); 
            pdstart = new Date(pdstart).Format("yyyy-MM");
            $("#ZZStartTime").val(pdstart);
       }
       GetRotationRate(_custid);
    });
    //周转率结束时间
    $("#JZEndTime").change(function(){
       var pdend = new Date($("#JZEndTime").val()).Format("yyyy-MM-dd");
       var pdstart = new Date($("#JZStartTime").val()).Format("yyyy-MM-dd");
       if(new Date(pdstart)>=new Date(pdend))
       {
            pdstart = new Date(pdstart).setDate(new Date(pdend).getDate()-20); 
            pdstart = new Date(pdstart).Format("yyyy-MM-dd");
            $("#JZStartTime").val(pdstart);
       }
       GetTrend(_custid);
    });
    //净值开始时间
    $("#JZStartTime").change(function(){
       var pdend = new Date($("#JZEndTime").val()).Format("yyyy-MM-dd");
       var pdstart = new Date($("#JZStartTime").val()).Format("yyyy-MM-dd");
       if(new Date(pdstart)>=new Date(pdend))
       {
            pdstart = new Date(pdstart).setDate(new Date(pdend).getDate()-20); 
            pdstart = new Date(pdstart).Format("yyyy-MM-dd");
            $("#JZStartTime").val(pdstart);
       }
       GetTrend(_custid);
    });
    },
    RiQi: function(){
    var currYear = (new Date()).getFullYear();	
			var opt={};
			opt.date = {preset : 'date'};
			//opt.datetime = { preset : 'datetime', minDate: new Date(2012,3,10,9,22), maxDate: new Date(2014,7,30,15,44), stepMinute: 5  };
			opt.datetime = {preset : 'datetime'};
			opt.time = {preset : 'time'};
			opt.default = {
				theme: 'android-ics light', //皮肤样式
		        display: 'modal', //显示方式 
		        mode: 'scroller', //日期选择模式
				lang:'zh',
		        startYear:currYear-5, //开始年份
		        endYear:currYear //结束年份
			};
            
			$("#PDStartTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));			$("#PDEndTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));			$("#ZZStartTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));			$("#ZZEndTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));			$("#JZStartTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));			$("#JZEndTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));    },
    FengGe: function(Data) {
    
        Data.BINDATA = JSON.parse(Data.BINDATA);
		Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
        var oData = Data.BINDATA.data.dataset;
        oData = eval(oData);
        if (oData.age != null && oData.age.length > 0) {
            $(".tag1").html(oData.age); $(".tag1").show();
        }
        if (oData.jz != null && oData.jz.length > 0) {
            $(".tag5").html(oData.jz); $(".tag5").show();
        }
        if (oData.zzl != null && oData.zzl.length > 0) {
            $(".tag2").html(oData.zzl); $(".tag2").show();
        }
        if (oData.hy != null && oData.hy.length > 0) {
            $(".tag6").html(oData.hy); $(".tag6").show();
        }
        if (oData.bk != null && oData.bk.length > 0) {
            $(".tag3").html(oData.bk); $(".tag3").show();
        }
        if (oData.ccts != null && oData.ccts.length > 0) {
            $(".tag7").html(oData.ccts); $(".tag7").show();
        }
        if (oData.mmfg != null && oData.mmfg.length > 0) {
            $(".tag4").html(oData.mmfg); $(".tag4").show();
        }
        if (oData.fx != null && oData.fx.length > 0) {
            $(".tag8").html(oData.fx); $(".tag8").show();
        }
    },
    PeiZhi: function(oData) {
        //资金配置环形图
        oData.BINDATA = JSON.parse(oData.BINDATA);
		oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
        var stk_value = oData.BINDATA.data.dataset.stk_value; //股票
        var fund_value = oData.BINDATA.data.dataset.fund_value; //基金
        var zs_financial_value = oData.BINDATA.data.dataset.zs_financial_value; //中山理财
        var bond_value = oData.BINDATA.data.dataset.bond_value; //债券及回购金额
        var cash_value = oData.BINDATA.data.dataset.cash_value; //现金余额
        var all_value = oData.BINDATA.data.dataset.all_value; //总资产
//        var stk_value = 92123.00; //股票
//        var fund_value = 0.00; //基金
//        var zs_financial_value = 0.00; //中山理财
//        var bond_value = 0.00; //债券及回购金额
//        var cash_value = 844.61; //现金余额
//        var all_value = 92967.61; //总资产
        var stk_Float = parseFloat(stk_value / all_value);
        var fund_Float = parseFloat(fund_value / all_value);
        var zs_Float = parseFloat(zs_financial_value / all_value);
        var bond_Float = parseFloat(bond_value / all_value);
        var cash_Float = parseFloat(cash_value / all_value);
        $('#peizhi').highcharts({
            chart: { type: 'pie' },
            title: { text: '' },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            credits: { enabled: false },
            plotOptions: {
                pie: {
                    size: 200,
                    innerSize: '85',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: 1,
                        style: { fontSize: "10px",fontWeight:"300" },
                        enabled: true,
                        formatter: function() { return this.point.name + '<br /> ' + (this.point.percentage).toFixed(2) + '%'; }
                        //format: '{point.name}:<br />{point.percentage:.2f} %'

                    }
                }
            },
            series: [{ type: 'pie', name: '持仓比例', data: [['股票持仓', stk_Float], ['基金持仓', fund_Float], ['中山理财持仓', zs_Float], ['债券及回购金额', bond_Float], ['现金余额', cash_Float]]}]
        });
    },
    HangYe: function(Data) {
        //持仓行业环形图
        Data.BINDATA = JSON.parse(Data.BINDATA);
		Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
        var oData = Data.BINDATA.data.dataset;
        oData = eval(oData);
        var all_money = 0;
        for (var i = 0; i < oData.length; i++) {
            all_money = parseFloat(all_money) + parseFloat(oData[i].propertion);
        }
        $('#hangye').highcharts({
            chart: {
                type: 'pie'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            tooltip: { formatter: function() { return '<b>' + this.point.name + '</b>:<br /> ' + (this.point.percentage).toFixed(2) + '%'; } },
            plotOptions: {
                pie: {
                    size: 132,
                    innerSize: '65',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: 1,
                        enabled: true,
                        style: { fontSize: "10px",fontWeight:"300" },
                        format: '{point.name}<br />{point.percentage:.2f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '持仓行业',
                data: (function() {
                    // generate an array of random data
                    var data = [];
                    for (var i = 0; i < oData.length; i++) {
                        data.push([oData[i].industryName, oData[i].propertion / all_money]);
                    }
                    return data;
                })()
}]

            });
        },
        PingDu: function(Data) {
            //交易频度柱形+折线图
            Data.BINDATA = JSON.parse(Data.BINDATA);
		    Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
            var oData = Data.BINDATA.data.dataset;
            oData = eval(oData);
            $('#pingdu').highcharts({
                chart: {},
                title: { text: '' },
                credits: { enabled: false },
                xAxis: { categories: (function() {
                    // generate an array of random data
                    var data = [];
                    for (var i = 0; i < oData.length; i++) {
                        data[i] = oData[i].month;
                    }
                    return data;
                })(), labels: { rotation: 80 }
                },
                yAxis: [{ labels: { format: '{value} 万' }, title: { text: ''} }, { title: { text: '' }, lineWidth: 1, opposite: true}],
                series: [{
                    type: 'column',
                    name: '买入金额(万元)', yAxis: 0,
                    data: (function() {
                        // generate an array of random data
                        var data = [];
                        for (var i = 0; i < oData.length; i++) {
                            if (oData[i].buyAmount != undefined) {
                                data[i] = oData[i].buyAmount /10000;
                            }
                            else {
                                data[i] = 0;
                            }
                        }
                        return data;
                    })()

                }, {
                    type: 'column',
                    name: '卖出金额(万元)', yAxis: 0,
                    data: (function() {
                        // generate an array of random data
                        var data = [];
                        for (var i = 0; i < oData.length; i++) {
                            if (oData[i].sellAmount != undefined) {
                                data[i] = oData[i].buyAmount  /10000;
                            }
                            else {
                                data[i] = 0;
                            }
                        }
                        return data;
                    })()

                }, {
                    type: 'line',
                    name: ' 买 入 次 数 ',
                    yAxis: 1,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[4],
                        fillColor: 'white'
                    },
                    data: (function() {
                        // generate an array of random data
                        var data = [];
                        for (var i = 0; i < oData.length; i++) {
                            if (oData[i].buyCount != undefined) {
                                data[i] = oData[i].buyCount * 1;
                            }
                            else {
                                data[i] = 0;
                            }
                        }
                        return data;
                    })()
                }, {
                    type: 'line',
                    name: '卖 出 次 数',
                    yAxis: 1,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[1],
                        fillColor: 'white'
                    },
                    data: (function() {
                        // generate an array of random data
                        var data = [];
                        for (var i = 0; i < oData.length; i++) {
                            if (oData[i].sellCount != undefined) {
                                data[i] = oData[i].sellCount * 1;
                            }
                            else {
                                data[i] = 0;
                            }
                        }
                        return data;
                    })()
}]
                });
            },
            ZhouZhuan: function(Data) {
                //资产周转率
//                var oData = '[{"custid":"10100000007","month":"201503","assetTurnover":"0.0000"},{"custid":"10100000007","month":"201504","assetTurnover":"0.7907"},{"custid":"10100000007","month":"201505","assetTurnover":"0.5839"},{"custid":"10100000007","month":"201506","assetTurnover":"0.0226"},{"custid":"10100000007","month":"201507","assetTurnover":"0.0000"}]';
                Data.BINDATA = JSON.parse(Data.BINDATA);
		Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
                var oData=Data.BINDATA.data.dataset;
                oData = eval(oData);
                $('#zhouzhuanlv').highcharts({
                    chart: {},
                    title: { text: '' },
                    credits: { enabled: false },
                    xAxis: { categories: (function() {
                        // generate an array of random data
                        var data = [];
                        for (var i = 0; i < oData.length; i++) {
                            data[i] = oData[i].month;
                        }
                        return data;
                    })(), labels: { rotation: 80 }
                    },
                    yAxis: [{ labels: { format: '{value}%' }, title: { text: ''}}],
                    series: [{
                        type: 'line',
                        name: '周转率',
                        data: (function() {
                            // generate an array of random data
                            var data = [];
                            for (var i = 0; i < oData.length; i++) {
                                data[i] = oData[i].assetTurnover * 1;
                            }
                            return data;
                        })()
}]
                    });
                },
                ZouShi: function(hData,myData) {
                    //沪深300指数
                    hData.BINDATA = JSON.parse(hData.BINDATA);
		            hData.BINDATA.data = JSON.parse(hData.BINDATA.data);
                    //var oData = '[{"date":"20150616","lastPrice":"5064.821"},{"date":"20150617","lastPrice":"5138.831"},{"date":"20150618","lastPrice":"4930.549"},{"date":"20150619","lastPrice":"4637.052"},{"date":"20150623","lastPrice":"4786.091"},{"date":"20150624","lastPrice":"4880.126"},{"date":"20150625","lastPrice":"4706.516"},{"date":"20150626","lastPrice":"4336.195"},{"date":"20150629","lastPrice":"4191.549"},{"date":"20150630","lastPrice":"4472.998"},{"date":"20150701","lastPrice":"4253.021"},{"date":"20150702","lastPrice":"4107.996"},{"date":"20150703","lastPrice":"3885.917"}]';
                    var oData=hData.BINDATA.data.dataset;
                    //var mData = '[{"custid":"10100000007","ocDate":"20150616","totalAssbal":"132319.5600","equity":"1.9674"},{"custid":"10100000007","ocDate":"20150617","totalAssbal":"136765.5900","equity":"2.0335"},{"custid":"10100000007","ocDate":"20150618","totalAssbal":"133665.5900","equity":"1.9874"},{"custid":"10100000007","ocDate":"20150619","totalAssbal":"125060.5900","equity":"1.8595"},{"custid":"10100000007","ocDate":"20150624","totalAssbal":"126369.6100","equity":"1.0000"},{"custid":"10100000007","ocDate":"20150625","totalAssbal":"122776.6200","equity":"0.9716"},{"custid":"10100000007","ocDate":"20150626","totalAssbal":"110532.6200","equity":"0.8747"},{"custid":"10100000007","ocDate":"20150629","totalAssbal":"105394.6300","equity":"0.8340"},{"custid":"10100000007","ocDate":"20150630","totalAssbal":"107872.6400","equity":"0.8536"},{"custid":"10100000007","ocDate":"20150701","totalAssbal":"103068.6400","equity":"0.8156"},{"custid":"10100000007","ocDate":"20150702","totalAssbal":"98704.6400","equity":"0.7811"},{"custid":"10100000007","ocDate":"20150703","totalAssbal":"94758.6500","equity":"0.7499"}]';
                    myData.BINDATA = JSON.parse(myData.BINDATA);
		            myData.BINDATA.data = JSON.parse(myData.BINDATA.data);
                    var mData=myData.BINDATA.data.dataset;
                    oData = eval(oData);
                    mData = eval(mData);
                    $('#zoushi').highcharts({
                        //净值走势
                        chart: {},
                        title: { text: '' },
                        credits: { enabled: false },
                        xAxis: { categories: (function() {
                            // generate an array of random data
                            var data = [];
                            for (var i = 0; i < oData.length; i++) {
                                data[i] = oData[i].date;
                            }
                            return data;
                        })(), labels: { rotation: 80 }
                        },
                        yAxis: [{ labels: { format: '{value}' }, title: { text: ''}}],
                        series: [{ type: 'line', name: '沪深300', data: (function() {
                            // generate an array of random data
                            var data = [];
                            for (var i = 0; i < oData.length; i++) {
                                data[i] = oData[i].lastPrice * 1;
                            }
                            return data;
                        })()
                        },
                                 { type: 'line', name: '净值', data: (function() {
                                     // generate an array of random data//未处理好，要求按照沪深300来，如果当天没有我的净值，则跳过
                                     var data = [];
                                     for (var i = 0; i < oData.length; i++) {
                                         for (var m = 0; m < mData.length; m++) {
                                             if (oData[i].date == mData[m].ocDate) {
                                                 data[i] = mData[m].equity * 1;
                                                 break;
                                             }
                                             else {
                                                 data[i] = 0;
                                             }
                                         }
                                     }
                                     return data;
                                 })()}]
                    });
                }
            }

    			