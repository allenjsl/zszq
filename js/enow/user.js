/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function(require, exports, module) {
	var $ = require('$');
	var TZT = new (require('tzt'))($);
	var not = require('rednot');
	var oTools = TZT.TOOLS;
	var myScroll;
	var begindate = ''; //开始时间
	var enddate = ''; //结束时间
	var V = '1.0', //版本
	    isnormallogin = '0', //是否普通登陆
	    userid = '', //客户id
	    fundid = '', //资金账号
	    custid = '', //客户代码
	    username = '', //客户昵称
	    realname = '', //客户姓名
	    mobileno = '', //客户手机号
	    headphoto='',//头像路径
	    x = new Array(), //近一周交易日
	    y1 = new Array(), //沪深300
	    y2 = new Array(); //我的净值
	$(function() {
		init();
	});
	function init() {
        oTools.setHeight($('#wrapper'), 45);
		myScroll = oTools.iscroll('#wrapper');
		pageEvent();
		GoBackOnLoad();
	}

	function pageEvent() {
		//登录
		$('#login').off('click').on('click', function() {
//			action10061('/zsjy/login.html');
            changeURL("http://action:10090/?loginkind=0&&jsfuncname=GoBackOnLoad()");
		})
		//头像
		$('.touxiang,#cancel').off('click').on('click', function() {
			$('.user-mask').slideToggle();
		})
		//拍照
		$('#snap').off('click').on('click', function() {
			snap(1);
		})
		$('#picture').off('click').on('click', function() {
			snap(2);
		})
		//开户
		$('#kaihu').off('click').on('click', function() {
        	if (TZT.DEVICE.ISANDROID) {
                changeURL('http://action:10073/?appurl='+encodeURIComponent('com.thinkive.mobile.account_zhongshan')+'&&opentype=2&&activityurl='+encodeURIComponent('com.zhongshan.video.activitys.HomeActivity')+'&&content='+encodeURIComponent('是否下载中山手机开户软件?')+'&&downloadurl='+encodeURIComponent( 'http://113.107.238.16/dd.myapp.com/16891/56AA49E88ADF90D2BFD2EA3336713F0F.apk?mkey=55daebb1fd81298c&f=d388&fsname=com.thinkive.mobile.account_zhongshan_1.0.1_1.apk&asr=02f1&p=.apk'));
        	} else {
                openacc();
        	}
		})
		//证券账号
		$('.zqzh').off('click').on('click', function() {
			if (isnormallogin != '1') {
				changeURL("http://action:10090/?loginkind=0&&jsfuncname=GoBackOnLoad()");
			} else {
				if (fundid) {
					action10061('/zsjy/jiaoyi.html');
				}else {
					alert('您还未开通证券账户！');
				}
			}
		})
		//账户分析
		$('.zhfx').off('click').on('click', function() {
			if (isnormallogin != '1') {
				changeURL("http://action:10090/?loginkind=0&&jsfuncname=GoBackOnLoad()");
			} else {
				if (fundid) {
					action10061('/zsjy/zhanghu.htm');
				}else {
					alert('您还未开通证券账户！');
				}
			}
		})
		//我的奖品
		$('.wdjp').off('click').on('click', function() {
			if (isnormallogin != '1') {
				changeURL("http://action:10090/?loginkind=0&&jsfuncname=GoBackOnLoad()");
			} else {
				changeURL('http://action:10061/?fullscreen=1&&url=/zsjy/jiangping.html&&type=99&&secondtext=领取话费&&secondurl=/zsjy/huafei.html');
			}
		})
		//我的消息
		$('.wdxx').off('click').on('click', function() {
			$('.news').remove();
			actionfunc10061('/zsjy/app/wd/wd-cxx/wd-cxx.html', 'clearmsg()');
		})
		//网上营业厅
		$('.wsyy').off('click').on('click', function() {
			action10061('/zsjy/yyt.html')
		})
		//设置
		$('#shezhi').off('click').on('click', function() {
			action10061('/zsjy/app/wd/wd-sz/wd-sz.html');
		})
		//退出
		$('#tuichu').off('click').on('click', function(event) {
			if (confirm('是否退出当前登录？')) {
				isnormallogin = '0';
				oTools.saveMapMesg({
						userid: '',
						username: '',
						realname: '',
						usertype: '',
						mobileno: '',
						fundid: '',
						custid: '',
						isnormallogin: ''
					}, function() {
						if (fundid) {
							changeURL("http://action:10402/?");
						}
						GoBackOnLoad();
					});
			}
		})
		//上传头像
		$('#upload').off('click').on('click', function() {
			DoUpload()
		});
	}
	//上传头像
	window.DoUpload=function () {
		$('.user-mask').hide();
		oTools.getLocalMesg(['headphotobase64'], function(oData) {
			if (oData.HEADPHOTOBASE64) {
				uploadheadphoto(oData.HEADPHOTOBASE64);
			} else {
				alert('请选择头像');
			}
		})
	}
	//获取净值排名
	function getrank() {
		var _oSend = {
			action: 31008,
			merid: "applogin",
			bizcode: "account.assbal.ranknumber",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({custid:custid,preTradeDate:enddate})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if (!oData.BINDATA.data) {
				return;
			}
			if (oData.BINDATA.data.errno != "0") {
				alert(oData.BINDATA.data.msg);
			}
			else {
				$('#rank').html(oData.BINDATA.data.dataset.rankNumber);
			}
		});
	}
	//获取头像
	function gettouxiang() {
		var _oSend = {
			action: 31004,
			merid: "applogin",
			bizcode: "account.myicon",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({userid:userid,type:"get",base64_icon:null})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
//			alert(JSON.stringify(oData));
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if (!oData.BINDATA.data) {
				return;
			}
			if (oData.BINDATA.data.errno != "0") {
				alert(oData.BINDATA.data.msg);
			}
			else {
				if (oData.BINDATA.data.dataset.url.length > 0) {
//						alert($('.touxiang').attr('src'));
					$('.touxiang').attr('src', oData.BINDATA.data.dataset.url);
				}
			}
		});
	}
	//调用拍照或手机相册
	function snap(_type) {
		changeURL('http://action:10051/?url=/zsjy/user.html?DoUpload=DoUpload&&userid='+userid+'&&val=' + headphoto + '.d&&gettype=' + _type);
	}
	//上传头像
	function uploadheadphoto(base64Img) {	
			var _oSend = {
				action: 31004,
				merid: "applogin",
				bizcode: "account.myicon",
				timestamp: TZT.TAG,
				req_id: Math.random(),
				v: V,
				charset: "utf-8",
				sign_type: "rsa",
				format: "json",
				data: JSON.stringify({userid:userid,type:"upload",base64_icon:base64Img})
			};

			TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
//			alert(JSON.stringify(oData));
				oData.BINDATA = JSON.parse(oData.BINDATA);
				oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
				if (!oData.BINDATA.data) {
					return;
				}
				if (oData.BINDATA.data.errno != "0") {
					alert(oData.BINDATA.data.msg);
				}
				else {
					if (oData.BINDATA.data.dataset.url.length > 0) {
						$('.touxiang').attr('src', oData.BINDATA.data.dataset.url);
					}
				}
			});
	}
	//获取剩余未兑话费
	function getaccountinfo() {
		var _oSend = {
			action: 31006,
			merid: "applogin",
			bizcode: "qiang.accountInfo",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({userid:userid})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			$('<span class="R_txt">话费<em class="fontred">' + oData.BINDATA.data.dataset.usableCount + '</em>元</span>').appendTo('.wdjp');
		});
	}
	//获取沪深300指数
	function gethushen300() {
		var _oSend = {
			action: 31008,
			merid: "applogin",
			bizcode: "account.hs300.number",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({startDate:begindate,endDate:enddate})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if (oData.BINDATA.data.errno != "0") {
				alert(oData.BINDATA.data.msg);
			}
			else {
				if (!oData.BINDATA.data.dataset) {
					return;
				}
				x = []; //近一周交易日
				y1 = []; //沪深300
				y2 = []; //我的净值
				$.each(oData.BINDATA.data.dataset, function(i, item) {
					var _jizhun = oData.BINDATA.data.dataset[0].lastPrice;
					x.push(item.date);
					y1.push((item.lastPrice / _jizhun).toFixed(2));
				})
				ichart.shezhi('hushen',x, y1, y2,myScroll);
			}
		});
	}
	//获取沪深300指数和我的净值
	function getjingzhi() {
		//获取沪深300
		var _oSend = {
			action: 31008,
			merid: "applogin",
			bizcode: "account.hs300.number",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({startDate:begindate,endDate:enddate})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if (oData.BINDATA.data.errno != "0") {
				alert(oData.BINDATA.data.msg);
			}
			else {
				if (!oData.BINDATA.data.dataset) {
					return;
				}
				x = []; //近一周交易日
				y1 = []; //沪深300
				y2 = []; //我的净值
				$.each(oData.BINDATA.data.dataset, function(i, item) {
					var _jizhun = oData.BINDATA.data.dataset[0].lastPrice;
					x.push(item.date);
					y1.push((item.lastPrice / _jizhun).toFixed(2));
				})
				
				//获取我的净值
				_oSend.bizcode = "account.total.assbal";
				_oSend.timestamp = TZT.TAG;
				_oSend.req_id = Math.random();
				_oSend.data = JSON.stringify({custid:custid,startDate:begindate,endDate:enddate});

				TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
					oData.BINDATA = JSON.parse(oData.BINDATA);
					oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
					if (!oData.BINDATA.data) {
						ichart.shezhi('jingzhi',x, y1, y2,myScroll);
						return;
					}
					if (oData.BINDATA.data.errno != "0") {
						alert(oData.BINDATA.data.msg);
					}
					else {
						if (!oData.BINDATA.data.dataset) {
							return;
						}
						$.each(oData.BINDATA.data.dataset, function(i, item) {
							var _biaozhun = oData.BINDATA.data.dataset[0].equity;
							y2.push(parseFloat(item.equity / _biaozhun).toFixed(2));
						})
						ichart.shezhi('jingzhi',x, y1, y2,myScroll);
					}
				});
			}
		});
	}
	
	window.GoBackOnLoad = function () {
		var now = new Date();
		//结束时间就是今天
		enddate = now.Format('yyyyMMdd');
		//开始时间提前一个星期
		begindate = new Date(now.setDate(now.getDate() - 15)).Format('yyyyMMdd');

		oTools.readMapMesg(['isnormallogin', 'userid', 'fundid', 'custid', 'username', 'realname', 'mobileno'], function(oData) {
			isnormallogin = oData.ISNORMALLOGIN;
			userid = oData.USERID;
			headphoto = '/zsjy/img/headphoto_1.jpg';
			fundid = oData.FUNDID;
			custid = oData.CUSTID;
			username = oData.USERNAME;
			realname = oData.REALNAME;
//			mobileno = oData.MOBILENO;


			//我的消息红点
			not.mesreadnot(function(type) {
				if (type) {
					$('<em class="radius news"></em>').appendTo('.yyt_icon04');
					tztsetrednot('33');
				} else {
					$('.news').remove();
				}
			});
			var jNotLogin = $('#notlogin'); //未登录
			var jNormalLogin = $('#normallogin'); //用户名登录
			var jAccountLogin = $('#accountlogin'); //资金账号登录
			var jTuiChu = $('#tuichu'); //退出

			//已登录
			if (isnormallogin == '1') {
				if (fundid) {
					$('.xingming').html(realname);
				} else {
					$('.yonghuming').html(username);
				}
				gettouxiang();
				getaccountinfo();
				jNotLogin.hide();
				jTuiChu.show();
				//资金帐号登录
				if (fundid != null && fundid.length > 0) {
					getrank();
					getjingzhi();
					jNormalLogin.hide();
					jAccountLogin.show();
				} else { //用户名登录
					gethushen300();
					jNormalLogin.show();
					jAccountLogin.hide();
				}
			} else { //未登录
				jNotLogin.show();
				jNormalLogin.hide();
				jAccountLogin.hide();
				jTuiChu.hide();
			}
		});
    }
});
var ichart= {
	shezhi:function (o,x,y1,y2,myScroll) { //设置曲线图
		var myChart = echarts.init(document.getElementById(o), 'macarons');
		
		option = {
			tooltip: {
				trigger: "axis",
				textStyle: { align: 'left' },
				axisPointer: { lineStyle: { color: '#dddddd', width: 1, type: 'dotted' } }
			},
			legend: {
				data: ['净值', '沪深300'],
				x: 'center',
				y: 'bottom'
			},
			color: ['#e55025', '#0068b7'],
			calculable: false,
			xAxis: [
				{
					type: 'category',
					axisLabel: { rotate: -45, margin: 3,interval:1 },
					boundaryGap: false,
					splitLine: { show: false },
					axisTick: { show: false },
					axisLine: { lineStyle: { color: '#dddddd', width: 0 } },
					data: x
				}
			],
			yAxis: [
				{
					type: 'value',
					color: '#444444',min:0.8,max:1.2,splitNumber: 4,
					axisLabel: { formatter: '{value}' },
					axisLine: { lineStyle: { color: '#666666', width: 0 } }
				}
			],
			grid: { x: '15%', y: '5%', x2: '15%', y2: '40%' },
			series: [{ type: 'line', smooth: false, name: '净值', data: y2 },
				{ type: 'line',smooth: false, name: '沪深300', data: y1
			}],
			animation: false
		};
		
		myChart.setOption(option);
		
		//图表清空
//		myChart.clear();
		
		//图表释放
//		myChart.dispose();
		
		$('#' + o).show();
		myScroll.refresh();
	}
}