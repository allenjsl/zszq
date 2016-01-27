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
//        _custid = 10100000007;
//        Charts.RiQi();
//        Charts.InitData();
//        Charts.CheckData(_custid,TZT);
//        $("#tubiao").show();
//        pageEvent();
    	oTools.readMapMesg(['userid', 'custid', 'username', 'mobileno'], function(oData) {
    		_userid = oData.USERID;
    		if(oData.CUSTID !=null && oData.CUSTID != undefined && oData.CUSTID !="")
    		{
    		_custid = oData.CUSTID;
    		Charts.InitData();
    		Charts.RiQi(_custid,TZT);
    		Charts.CheckData(_custid,TZT);
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
        Charts.GetStyle(_custid,TZT);
        Charts.GetAssetAllocation(_custid,TZT);
        Charts.GetIndustryPosition(_custid,TZT);
        Charts.GetTradingFrequency(_custid,TZT);
        Charts.GetRotationRate(_custid,TZT);
        Charts.GetTrend(_custid,TZT);
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
			data: JSON.stringify({userid:_userid,type:"get",base64_icon:null})
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
    
});

 function TimeChange(inputid,_custid,TZT){
 
    if(inputid=="PDStartTime")
    {
       //交易频度开始时间
       var pdend = new Date($("#PDEndTime").val()).Format("yyyy-MM");
       var pdstart = new Date($("#PDStartTime").val()).Format("yyyy-MM");
       var myDate = new Date().Format("yyyy-MM");//现今时间
       $("#PDStartTime").val(pdstart);
        var pdendstart = new Date(pdstart).setMonth(new Date(pdstart).getMonth()+5); //开始月份后6个月
       if(new Date(pdstart)>=new Date(pdend))
       {
         if(new Date(pdstart)>=new Date(myDate))
         {
              var pdstime=new Date(myDate).setMonth(new Date(myDate).getMonth()-5); 
              $("#PDStartTime").val(new Date(pdstime).Format("yyyy-MM"));
              $("#PDEndTime").val(new Date(myDate).Format("yyyy-MM"));
         }
         else
         {
           //如果结束时间大于开始月份后6个月，则修改结束时间为开始时间后6个月
           if(new Date(pdendstart)>=new Date(myDate))
           {
              $("#PDEndTime").val( new Date(myDate).Format("yyyy-MM"));
           }
           else
           {
             $("#PDEndTime").val( new Date(pdendstart).Format("yyyy-MM"));
           }
         }
       }
       Charts.GetTradingFrequency(_custid,TZT);
      } 
       
     if(inputid=="PDEndTime")
    {
      //交易频度结束时间
       var pdend = new Date($("#PDEndTime").val()).Format("yyyy-MM");
       var myDate = new Date().Format("yyyy-MM");
        if(new Date(pdend)<=new Date(myDate))
       {
         $("#PDEndTime").val(pdend);
       }
       else
       {
         $("#PDEndTime").val(myDate);
       }
       var pdstart = new Date($("#PDStartTime").val()).Format("yyyy-MM");
       //结束月份前6个月
       var pdstartend = new Date(pdend).setMonth(new Date(pdend).getMonth()-5); 
       //如果开始时间小于结束月份前6个月，则修改开始时间为结束时间前6个月
       if(new Date(pdstartend)<=new Date(pdstart))
       {
            pdstartend = new Date(pdstartend).Format("yyyy-MM");
            $("#PDStartTime").val(pdstartend);
       }
       Charts.GetTradingFrequency(_custid,TZT);
    }
     if(inputid =="ZZEndTime")
    {
       //周转率结束时间
       var pdend = new Date($("#ZZEndTime").val()).Format("yyyy-MM");
       var myDate = new Date().Format("yyyy-MM");
        if(new Date(pdend)<=new Date(myDate))
       {
         $("#ZZEndTime").val(pdend);
       }
       else
       {
         $("#ZZEndTime").val(myDate);
       }
       
       var pdstart = new Date($("#ZZStartTime").val()).Format("yyyy-MM");
       //结束月份前6个月
       var pdstartend = new Date(pdend).setMonth(new Date(pdend).getMonth()-5); 
       //如果开始时间小于结束月份前6个月，则修改开始时间为结束时间前6个月
       if(new Date(pdstartend)<=new Date(pdstart))
       {
            pdstartend = new Date(pdstartend).Format("yyyy-MM");
            $("#ZZStartTime").val(pdstartend);
       }
       Charts.GetRotationRate(_custid,TZT);
    }
     if(inputid =="ZZStartTime")
    {
       //周转率开始时间
       var pdend = new Date($("#ZZEndTime").val()).Format("yyyy-MM");
       var pdstart = new Date($("#ZZStartTime").val()).Format("yyyy-MM");
       var myDate = new Date().Format("yyyy-MM");//现今时间
       $("#ZZStartTime").val(pdstart);
       var pdendstart = new Date(pdstart).setMonth(new Date(pdstart).getMonth()+5); //开始月份后6个月
       if(new Date(pdstart)>=new Date(pdend))
       {
         if(new Date(pdstart)>=new Date(myDate))
         {
              var pdstime=new Date(myDate).setMonth(new Date(myDate).getMonth()-5); 
              $("#ZZStartTime").val(new Date(pdstime).Format("yyyy-MM"));
              $("#ZZEndTime").val(new Date(myDate).Format("yyyy-MM"));
         }
         else
         {
           //如果结束时间大于开始月份后6个月，则修改结束时间为开始时间后6个月
           if(new Date(pdendstart)>=new Date(myDate))
           {
              $("#ZZEndTime").val( new Date(myDate).Format("yyyy-MM"));
           }
           else
           {
             $("#ZZEndTime").val( new Date(pdendstart).Format("yyyy-MM"));
           }
         }
       }
       Charts.GetRotationRate(_custid,TZT);
    }
     if(inputid =="JZEndTime")
    {
    //净值结束时间
       var pdend = new Date($("#JZEndTime").val()).Format("yyyy-MM-dd");
       
       var myDate = new Date().Format("yyyy-MM-dd");
        if(new Date(pdend)<=new Date(myDate))
       {
         $("#JZEndTime").val(pdend);
       }
       else
       {
         $("#JZEndTime").val(myDate);
       }
       
       
       var pdstart = new Date($("#JZStartTime").val()).Format("yyyy-MM-dd");
       
       //结束日期前15天
       var pdstartend = new Date(pdend).setDate(new Date(pdend).getDate()-15); 
       //如果开始时间小于结束时间前15天，则修改开始时间为结束时间前15天
       if(new Date(pdstartend)<=new Date(pdstart))
       {
            pdstartend = new Date(pdstartend).Format("yyyy-MM-dd");
            $("#JZStartTime").val(pdstartend);
       }
       Charts.GetTrend(_custid,TZT);
    }
     if(inputid =="JZStartTime")
    {
    //净值开始时间
       var pdend = new Date($("#JZEndTime").val()).Format("yyyy-MM-dd");
       var pdstart = new Date($("#JZStartTime").val()).Format("yyyy-MM-dd");
       var myDate = new Date().Format("yyyy-MM-dd");//现今时间
       $("#JZStartTime").val(pdstart);
       var pdendstart = new Date(pdstart).setDate(new Date(pdstart).getDate()+15);
       if(new Date(pdstart)>=new Date(pdend))
       {
         if(new Date(pdstart)>=new Date(myDate))
         {
              var pdstime=new Date(myDate).setDate(new Date(myDate).getDate()-15); 
              $("#JZStartTime").val(new Date(pdstime).Format("yyyy-MM-dd"));
              $("#JZEndTime").val(new Date(myDate).Format("yyyy-MM-dd"));
         }
         else
         {
           if(new Date(pdendstart)>=new Date(myDate))
           {
              $("#JZEndTime").val( new Date(myDate).Format("yyyy-MM-dd"));
           }
           else
           {
             $("#JZEndTime").val( new Date(pdendstart).Format("yyyy-MM-dd"));
           }
         }
       }
      
       Charts.GetTrend(_custid,TZT);
    }
       
       
    }

            
          var Charts = {
          
          //获取个人投资风格
    GetStyle:function(_custid,TZT) {
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
            data: JSON.stringify({custid:_custid})
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.FengGe(oData);
        });
        //Charts.FengGe();
    },
    //获取客户资产配置
    GetAssetAllocation:function(_custid,TZT) {
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
            data: JSON.stringify({custid:_custid})
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.PeiZhi(oData);
        });
        //Charts.PeiZhi();
    },
    //获取客户行业持仓
    GetIndustryPosition:function(_custid,TZT) {
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
            data: JSON.stringify({custid:_custid})
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.HangYe(oData);
        });
        //Charts.HangYe();
    },
    //获取客户交易频度
    GetTradingFrequency:function(_custid,TZT) {
    
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
            data: JSON.stringify({custid:_custid,startDate:new Date($("#PDStartTime").val()).Format("yyyyMM"),endDate:new Date($("#PDEndTime").val()).Format("yyyyMM")})
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.PingDu(oData);
        });
        //Charts.PingDu();
    },
    //获取客户资产周转率
    GetRotationRate:function(_custid,TZT) {
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
            data: JSON.stringify({custid:_custid,startDate:new Date($("#ZZStartTime").val()).Format("yyyyMM"),endDate:new Date($("#ZZEndTime").val()).Format("yyyyMM")})
        };
        TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
            Charts.ZhouZhuan(oData);
        });
        //Charts.ZhouZhuan();
    },
    //获取净值走势
    GetTrend:function(_custid,TZT) {
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
            data: JSON.stringify({startDate:new Date($("#JZStartTime").val()).Format("yyyyMMdd"),endDate:new Date($("#JZEndTime").val()).Format("yyyyMMdd")})
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
            data: JSON.stringify({custid:_custid,startDate:new Date($("#JZStartTime").val()).Format("yyyyMMdd"),endDate:new Date($("#JZEndTime").val()).Format("yyyyMMdd")})
        };
        TZT.getData(TZT.REQ.XML, _oSend1, function(oData) {
            mData = oData;
            Charts.ZouShi(hData,mData);
        });
        });
        
        
    },   
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
    CheckData: function(_custid,TZT){
    
    },
    RiQi: function(_custid,TZT){
    (function($) {
				$.init();
				var btns = $("input[data-class=rili]");
				var pickers = {};
				btns.each(function(i, btn) {
					btn.addEventListener('tap', function() {
						var optionsJson = this.getAttribute('data-options') || '{}';
						var options = JSON.parse(optionsJson);
						var id = this.getAttribute('id');
						/*
						 * 首次显示时实例化组件
						 * 示例为了简洁，将 options 放在了按钮的 dom 上
						 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
						 */
						options.value = document.getElementById(id).value;
						pickers[id] = pickers[id] || new $.DtPicker(options);
						pickers[id].show(function(rs) {
							/*
							 * rs.value 拼合后的 value
							 * rs.text 拼合后的 text
							 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
							 * rs.m 月，用法同年
							 * rs.d 日，用法同年
							 * rs.h 时，用法同年
							 * rs.i 分（minutes 的第二个字母），用法同年
							 */
							 document.getElementById(id).value=rs.text;
							 document.getElementById(id).onchange =TimeChange(id,_custid,TZT);
						});
					}, false);
				});
			})(mui);
//    var currYear = (new Date()).getFullYear();	
//			var opt={};
//			opt.date = {preset : 'date'};
//			//opt.datetime = { preset : 'datetime', minDate: new Date(2012,3,10,9,22), maxDate: new Date(2014,7,30,15,44), stepMinute: 5  };
//			opt.datetime = {preset : 'datetime'};
//			opt.time = {preset : 'time'};
//			opt.default = {
//				theme: 'android-ics light', //皮肤样式
//		        display: 'modal', //显示方式 
//		        mode: 'scroller', //日期选择模式
//				lang:'zh',
//		        startYear:currYear-5, //开始年份
//		        endYear:currYear //结束年份
//			};
//            
//			$("#PDStartTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
//			$("#PDEndTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
//			$("#ZZStartTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
//			$("#ZZEndTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
//			$("#JZStartTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
//			$("#JZEndTime").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
    },
    FengGe: function(Data) {
    
        Data.BINDATA = JSON.parse(Data.BINDATA);
		Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
        var oData = Data.BINDATA.data.dataset;
        oData = eval(oData);
        if (oData.age != null && oData.age.length > 0) {
            $(".tag5").html(oData.age); $(".tag5").show();
        }
        if (oData.mmfg != null && oData.mmfg.length > 0) {
            $(".tag1").html(oData.mmfg); $(".tag1").show();
        }
        if (oData.ccts != null && oData.ccts.length > 0) {
            $(".tag2").html(oData.ccts); $(".tag2").show();
        }
        if (oData.bk != null && oData.bk.length > 0) {
            $(".tag6").html(oData.bk); $(".tag6").show();
        }
        if (oData.zzl != null && oData.zzl.length > 0) {
            $(".tag4").html(oData.zzl); $(".tag4").show();
        }
        if (oData.jz != null && oData.jz.length > 0) {
            $(".tag3").html(oData.jz); $(".tag3").show();
        }
    },
    PeiZhi: function(oData) {
        //资金配置环形图
        oData.BINDATA = JSON.parse(oData.BINDATA);
		oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
		if(oData.BINDATA.data.dataset !=null)
		{
        var stk_value = oData.BINDATA.data.dataset.stk_value; //股票
        var fund_value = oData.BINDATA.data.dataset.fund_value; //基金
        var zs_financial_value = oData.BINDATA.data.dataset.zs_financial_value; //中山理财
        var bond_value = oData.BINDATA.data.dataset.bond_value; //债券及回购金额
        var cash_value = oData.BINDATA.data.dataset.cash_value; //现金余额
        var all_value = oData.BINDATA.data.dataset.all_value; //总资产
        var stk_Float = parseFloat(stk_value / all_value);
        var fund_Float = parseFloat(fund_value / all_value);
        var zs_Float = parseFloat(zs_financial_value / all_value);
        var bond_Float = parseFloat(bond_value / all_value);
        var cash_Float = parseFloat(cash_value / all_value);
        var myChart = echarts.init(document.getElementById('zcpz'), 'macarons');
            option = {
    color:['#e55125','#28a4d1','#5060c3','#d6b324','#bd2c5d'],
    calculable : false,
    series : [
        {
            name:'资产配置',
            type:'pie',
            radius : ['30%', '50%'],
            funnelAlign: 'center',
			startAngle:60,
			minAngle:3,
            itemStyle:{ 
            normal:{ 
                  label:{ 
                    show: true,
                    textStyle : {
                                    color : '#000000',
                                    fontSize : 14
                                },
                    formatter: '{b}\n{d}%' 
                  }, 
                  labelLine :{  length : 7,
                                lineStyle : {
                                    color : '#000000'
                                }} 
                } 
            },
            data:(function() {
                    // generate an array of random data
                    var data = [];
                    if( parseFloat(stk_Float)>0)
                    {
                        data.push({value:stk_Float, name:'股票'});
                    }
                    if( parseFloat(zs_Float)>0)
                    {
                        data.push({value:zs_Float, name:'理财'});
                    }
                    if( parseFloat(cash_Float)>0)
                    {
                        data.push({value:cash_Float, name:'现金类'});
                    }
                    if( parseFloat(fund_Float)>0)
                    {
                        data.push({value:fund_Float, name:'基金'});
                    }
                    if( parseFloat(bond_Float)>0)
                    {
                        data.push({value:bond_Float, name:'债券'});
                    }
                    
                    return data;
                })()
        }
    ],
            	animation: false
}

        myChart.setOption(option);
        }
        else
        {
        document.getElementById('pz').style.display="none";
        }
    },
    HangYe: function(Data) {

        //持仓行业环形图
        Data.BINDATA = JSON.parse(Data.BINDATA);
		Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
        var oData = Data.BINDATA.data.dataset;
        if(oData.length>0)
        {
        oData = eval(oData);
        var all_money = 0;
        for (var i = 0; i < oData.length; i++) {
            all_money = parseFloat(all_money) + parseFloat(oData[i].propertion);
        }
        
        var myChart = echarts.init(document.getElementById('hangye'), 'macarons');
            option = {
    color:['#e55125','#28a4d1','#5060c3','#d6b324','#bd2c5d','#2ec7c9','#b6a2de','#8d98b3','#97b552','#95706d'],
    calculable : false,
    series : [
        {
            name:'持仓行业',
            type:'pie',
            radius : ['27%', '45%'],
            funnelAlign: 'center',
			startAngle:110,
			minAngle:3,
            itemStyle:{ 
            normal:{ 
                  label:{ 
                    show: true,
                    textStyle : {
                                    color : '#000000',
                                    fontSize : 14
                                },
                    formatter: '{b}\n{d}%' 
                  }, 
                  labelLine :{  length : 7,
                                lineStyle : {
                                    color : '#000000'
                                }} 
                } 
            },
            data:(function() {
                    // generate an array of random data
                    var data = [];
                    for (var i = 0; i < oData.length; i++) {
                        data.push({value:oData[i].propertion / all_money, name:oData[i].industryName});
                    }
                    return data;
                })()
        }
    ],
            	animation: false
}

        myChart.setOption(option);
        }
        else
        {
        document.getElementById('hy').style.display="none";
        }
        },
        PingDu: function(Data) {
            //交易频度柱形+折线图
            Data.BINDATA = JSON.parse(Data.BINDATA);
		    Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
            var oData = Data.BINDATA.data.dataset;
            if(oData.length>0)
            {
            oData = eval(oData);
            var myChart = echarts.init(document.getElementById('jypd'), 'macarons');
            option = {
                tooltip : {
                    trigger: 'axis',
	             	textStyle:{align:'left'},
            		axisPointer:{lineStyle:{color:'#dddddd',width:1,type:'dotted'} }
                },
                color:['#e55026','#0068b7','#feb83c','#ab5d14'],
                calculable : false,
                legend: {
                    data:['买入金额','卖出金额','','买入次数','卖出次数'],
                    x:'center',
                    y:'bottom'
               },
               xAxis : [
               {
                   type : 'category',
                   axisLabel: {rotate: -45,margin:3},
                   splitLine:{show:false},
		           axisTick:{show:false},
                   axisLine:{lineStyle:{color:'#dddddd',width:0}},
                   data : (function() {
                        // generate an array of random data
                        var data = [];
                        for (var i = 0; i < oData.length; i++) {
                        data[i] = oData[i].month;
                    }
                        return data;
                    })()
              }
              ],
              yAxis : [
              {
                 type : 'value',
                 name : '金额(万元)',
		         splitNumber: 10,
                 axisLine:{lineStyle:{color:'#666666',width:0}},
                 axisLabel : {
                 formatter: '{value}'
              }
              },
             {
                type : 'value',
                name : '次数',
			    splitNumber: 10,
                axisLine:{lineStyle:{color:'#666666',width:0}},
                axisLabel : {
                formatter: '{value}'
             }
        }
    ],

  grid:{x:'15%',y:'5%',x2:'15%',y2:'30%'},
  
  series : [
        {
            name:'买入金额',
            type:'bar',
            barGap:'0%',    
            data:(function() {
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
         
        },
        {
            name:'卖出金额',
            type:'bar',   
            data:(function() {
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
        },
        {
            name:'买入次数',
            type:'line',
            yAxisIndex: 1,
            smooth:false,
            data:(function() {
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
        },
        {
            name:'卖出次数',
            type:'line',
            yAxisIndex: 1,
            smooth:false,
            data:(function() {
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
        },
    
        ],
            	animation: false
       }
        myChart.setOption(option);
        }
        else
        {
        document.getElementById('pd').style.display="none";
        }
            },
            ZhouZhuan: function(Data) {
                //资产周转率
                Data.BINDATA = JSON.parse(Data.BINDATA);
         		Data.BINDATA.data = JSON.parse(Data.BINDATA.data);
                var oData=Data.BINDATA.data.dataset;
                oData = eval(oData); 
                var myChart = echarts.init(document.getElementById('zzl'), 'macarons');
                option = {
                   tooltip : {
	                  trigger: 'axis',
                      formatter: '{c}%',
		              axisPointer:{lineStyle:{color:'#dddddd',width:1,type:'dotted'} }
                   },
                   color : ['#e55125','#0068b7'],
                   calculable : false,
                   xAxis : [
                   {
                      type : 'category',
                      axisLabel: {rotate: -45,margin:3},
                      boundaryGap : false,
                      splitLine:{show:false},
			          axisTick:{show:false},
                      axisLine:{lineStyle:{color:'#dddddd',width:0}},
                      data : (function() {
                         // generate an array of random data
                         var data = [];
                         for (var i = 0; i < oData.length; i++) {
                            data[i] = oData[i].month;
                         }
                         return data;
                      })()
                    }
                    ],
                   yAxis : [
                   {
                      type : 'value', 
                      color:'#444444',
                      axisLabel : {formatter: '{value}%'},
                      axisLine:{lineStyle:{color:'#666666',width:0}}
                   }
                   ],
                   grid:{x:'18%',y:'5%',x2:'15%',y2:'25%'},
                   series : [
                   {
                      name:'',
                      type:'line',
                      smooth:false,
                      data:(function() {
                            // generate an array of random data
                            var data = [];
                            for (var i = 0; i < oData.length; i++) {
                                data[i] = oData[i].assetTurnover * 1;
                            }
                            return data;
                        })()
                   }
                  ],
                	animation: false
                };
                myChart.setOption(option);
                },
                ZouShi: function(hData,myData) {
                
                    //沪深300指数
                    hData.BINDATA = JSON.parse(hData.BINDATA);
		            hData.BINDATA.data = JSON.parse(hData.BINDATA.data);
		            myData.BINDATA = JSON.parse(myData.BINDATA);
		            myData.BINDATA.data = JSON.parse(myData.BINDATA.data);
		            
		            if(myData.BINDATA.message=='日期传入异常，请重新传入!')
		            {
		                alert("请确定起止时间！");
		                var oData=hData.BINDATA.data.dataset;
		                oData = eval(oData);
		                var JD_value =oData[0].lastPrice * 1; //总资产
                        var myChart = echarts.init(document.getElementById('zoushi'), 'macarons');
                        option = {
                           tooltip : {
	                          trigger: "axis",
                              textStyle:{align:'left'},
		                      axisPointer:{lineStyle:{color:'#dddddd',width:1,type:'dotted'} }
                           },
                           legend: {
                              data:['沪深300'],
                              x:'center',
                              y:'bottom'
                           },
                           color : ['#e55025','#0068b7'],
                           calculable : false,
                           xAxis : [
                           {
                               type : 'category',
                               axisLabel: {rotate: -45,margin:3,interval:1},
                               boundaryGap : false,
                               splitLine:{show:false},
			                   axisTick:{show:false},
                               axisLine:{lineStyle:{color:'#dddddd',width:0}},
                               data : (function() {
                                 var data = [];
                                 for (var i = 0; i < oData.length; i++) {
                                    data[i] = oData[i].date;
                                 }
                                 return data;
                               })()
                          }
                          ],
                          yAxis : [
                         {
                             type : 'value', 
                             color:'#444444',
                             splitNumber: 4,
                             min:0.8,
                             max:1.2,
                             axisLabel : {formatter: '{value}'},
                             axisLine:{lineStyle:{color:'#666666',width:0}}
                          }
                          ],
                          grid:{x:'18%',y:'5%',x2:'15%',y2:'25%'},
                          series : [{ type: 'line',smooth:false, name: '沪深300', data: (function() {
                              var data = [];
                              for (var i = 0; i < oData.length; i++) {
                                data[i] = (oData[i].lastPrice * 1 / JD_value).toFixed(2);
                              }
                              return data;
                              })()
                          }],
                        	animation: false
                     };
                    myChart.setOption(option);
		         }
		         else{
                    var oData=hData.BINDATA.data.dataset;
                    var mData=myData.BINDATA.data.dataset;
                    oData = eval(oData);
                    mData = eval(mData);
                    var JD_value =oData[0].lastPrice * 1; //总资产
                    var JZ_value =mData[0].equity * 1; //总资产
                    var myChart = echarts.init(document.getElementById('zoushi'), 'macarons');
                    option = {
                        tooltip : {
	                       trigger: "axis",
                           textStyle:{align:'left'},
		                   axisPointer:{lineStyle:{color:'#dddddd',width:1,type:'dotted'} }
                        },
                        legend: {
                          data:['净值','沪深300'],
                          x:'center',
                          y:'bottom'
                        },
                        color : ['#e55025','#0068b7'],
                        calculable : false,
                        xAxis : [
                        {
                           type : 'category',
                           axisLabel: {rotate: -45,margin:3,interval:1},
                           boundaryGap : false,
                           
                           splitLine:{show:false},
			               axisTick:{show:false},
                           axisLine:{lineStyle:{color:'#dddddd',width:0}},
                           data : (function() {
                               var data = [];
                               for (var i = 0; i < oData.length; i++) {
                                  data[i] = oData[i].date;
                               }
                               return data;
                               })()
                         }
                         ],
                         yAxis : [
                         {
                            type : 'value', 
                            color:'#444444',
                            min:0.8,
                            max:1.2,
                            splitNumber: 4,
                            axisLabel : {formatter: '{value}'},
                            axisLine:{lineStyle:{color:'#666666',width:0}}
                         }
                         ],
                         grid:{x:'18%',y:'5%',x2:'15%',y2:'25%'},
                         series : [{ type: 'line',smooth:false, name: '沪深300', data: (function() {
                             var data = [];
                             for (var i = 0; i < oData.length; i++) {
                                data[i] = (oData[i].lastPrice * 1 / JD_value).toFixed(2);
                             }
                             return data;
                             })()
                        },
                        { type: 'line',smooth:false, name: '净值', data: (function() {
                        //未处理好，要求按照沪深300来，如果当天没有我的净值，则跳过
                                     var data = [];
                                     for (var i = 0; i < oData.length; i++) {
                                         for (var m = 0; m < mData.length; m++) {
                                             if (oData[i].date == mData[m].ocDate) {
                                                 data[i] = (mData[m].equity * 1 / JZ_value).toFixed(2);
                                                 break;
                                             }
                                             else {
                                                 data[i] = 0;
                                             }
                                         }
                                     }
                                     return data;
                                 })()}],
                    	animation: false
                        };

                       myChart.setOption(option);
                     }

                }
                             }