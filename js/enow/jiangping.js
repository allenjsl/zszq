/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
//    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var myScroll1;
    var myScroll2;
	var userid = '';
	var pagenum1 = 1;
	var pagenum2 = 1;
	var V = 1.0;
	$(function() {
		init();
	});
    function init() {
    	GoBackOnLoad();
        myScroll1 = oTools.iscroll('#wrapper1', function (type, fn) {
            if (type == 'more') {
                pagenum1 += 1;
                getmiaoshas(pagenum1, 'more', fn);
            }
            else {
                pagenum1 = 1;
                getmiaoshas(pagenum1, '', fn);
            }
        });
        myScroll2 = oTools.iscroll('#wrapper2', function (type, fn) {
            if (type == 'more') {
                pagenum2 += 1;
                getduijiangs(pagenum2, 'more', fn);
            }
            else {
                pagenum2 = 1;
                getduijiangs(pagenum2, '', fn);
            }
        });
		pageEvent();
    }
    function pageEvent() {
    	$("li[data-class='tab_biaoti']").on('click',function() {
    		var _index = $("li[data-class='tab_biaoti']").index(this);
    		$("li[data-class='tab_biaoti']").removeClass("active").addClass("normal");
    		$(this).addClass("active");
    		$("div[data-class='tab_neirong']").hide();
    		$("div[data-class='tab_neirong']").eq(_index).show();
    	});
    }
	function getmiaoshas(ncount, type, fn) {
		var _oSend = {
			action: 31004,
			merid: "applogin",
			bizcode: "qiang.records",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({userid:userid,pageSize:10,currentPage:ncount})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			if (!oData.list)
			{
				if (ncount == 1 || type != 'more') {
					$('#miaosha').html(TZT.nodatadom);
				}
				fn && fn();
				return;
			}
			var sDom = '';
			$.each(oData.list, function(i, item) {
				//秒杀场次
				var _subject = item.subject;
				//秒杀时间
				var _dateCreate = getDate(item.dateCreate);
				//秒中金额
				var _amount = item.amount;
				//秒中状态
				var _status = (item.status == 'Y' ? '秒杀成功' : '秒杀失败');

				sDom += '<li>' +
					'    <div class="left_txt">' +
						'        <p>' + _subject + '</p>' +
							'        <p class="font12 font_gray">' + _dateCreate + '</p>' +
								'    </div>' +
									'    <div class="right_txt">' +
										'        <p class="font14"><em class="fontred">' + _amount + '</em>元</p>' +
											'        <p class="font14 font_gray">' + _status + '</p>' +
												'    </div>' +
													'</li>';
			});
			if (type == 'more') {
				$('#miaosha').append(sDomCC);
			} else {
				$('#miaosha').html(sDom);
			}
			fn && fn();
		});
	}
	function getduijiangs(ncount, type, fn) {
		var _oSend = {
			action: 31004,
			merid: "applogin",
			bizcode: "qiang.lqrecords",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({userid:userid,pageSize:10,currentPage:ncount})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			if (!oData.list)
			{
				if (ncount == 1 || type != 'more') {
					$('#duijiang').html(TZT.nodatadom);
				}
				fn && fn();
				return;
			}
			var sDom = '';
			$.each(oData.list, function(i, item) {
				//兑奖手机
				var _mobile = item.mobile;
				//秒杀时间
				var _dateCreate = getDate(item.dateCreate);
				//兑奖时间
				var _dateUpdate = item.dateUpdate;
				//兑奖金额
				var _account = item.account;
				//秒中状态
				var _status = (item.status == 'Y' ? '秒杀成功' : '秒杀失败');
				//兑奖状态
				var _remark = item.remark;

				sDom += '<li>' +
					'    <div class="left_txt">' +
						'        <p>向手机号 ' + _mobile + ' 充值</p>' +
							'        <p class="font12 font_gray">' + _dateUpdate + '</p>' +
								'    </div>' +
									'    <div class="right_txt">' +
										'        <p class="font14"><em class="fontred">' + _account + '</em>元</p>' +
											'        <p class="font14 font_gray">' + _remark + '</p>' +
												'    </div>' +
													'</li>';
			});
			if (type == 'more') {
				$('#duijiang').append(sDomCC);
			} else {
				$('#duijiang').html(sDom);
			}
			fn && fn();
		});
	}
	function getDate(tm) {
		var tt = new Date(parseInt(tm) * 1000).toLocaleString().replace( /年|月/g , "-").replace( /日/g , " ");
		return tt;
	}	
	window.GoBackOnLoad = function () {
    	oTools.readMapMesg(['isnormallogin','userid'], function(oData) {
    		if (oData.ISNORMALLOGIN != '1') {
    			//10071
    			changeURL("http://action:10090/?loginkind=0&&jsfuncname=GoBackOnLoad()");
//    			action10061('/zsjy/login.html');
    		} else {
    			userid = oData.USERID;
    	        getmiaoshas(pagenum1);
    	        getduijiangs(pagenum2);
    		}
    	});
    }
});