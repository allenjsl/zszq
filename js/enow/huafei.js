/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
	var userid = '';
	var pid = '';
	var V = 1;
    $(function () {
        init();
    });
    function init() {
//		oTools.iscroll('#wrapper');
    	GoBackOnLoad();
    	pageEvent();
    }
    function pageEvent() {
    	$('#shouji').on('click',function () {
    		action10061('/zsjy/shouji.html');
    	})
    	$('.num-add').on('click',function () {
    		var _fenshu = $('#fenshu');
    		if (parseInt(_fenshu.val()||0)*parseFloat($('#duihuanyue').html())>parseFloat($('#duihuandanwei').html())) {
    			return false;
    		}
    		_fenshu.val(parseInt(_fenshu.val()||0) + 1);
    	})
    	$('.num-minus').on('click',function () {
    		var _fenshu = $('#fenshu');
    		if (parseInt(_fenshu.val()||1)<=0) {
    			return false;
    		}
    		_fenshu.val(parseInt(_fenshu.val()||1) - 1);
    	})
    	$('#lingqu').on('click',function () {
    		var _fenshu = $('#fenshu').val()||0;
    		var _duihuanyue = $('#duihuanyue').html();
    		var _duihuandanwei = $('#duihuandanwei').html();
    		var _shouji = $('#shouji').html();
    		var _lqCount = parseInt(_fenshu) * parseFloat(_duihuandanwei);

		    if (!TZT.REG.PHONE.test(_shouji)) {
			    alert('请绑定充值手机号码');
			    return false;
		    }
    		if (_lqCount>parseFloat(_duihuanyue)) {
    			alert('领取金额不能大于话费金额');
    			return false;
    		}
    		if (parseInt(_fenshu)<=0) {
    			alert('领取份数不能小于1');
    			return false;
    		}
    		
    		lingqu(_shouji,_lqCount);
    	})
    }
	/**
	 * 查询个人账户信息
	 * 信息，包括总话费，分享获得话费，可领取话费等
	 */
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
			oTools.saveMapMesg({ pid: oData.BINDATA.data.pid, usablecount: oData.BINDATA.data.usableCount}, function() {$('#duihuanyue').val(oData.BINDATA.data.usableCount);pid = oData.BINDATA.data.pid;});
		});
	}
	/**
	 * 话费领取
	 * @param {String} _bindmobile 兑换手机
	 * @param {String} _lqCount 领取额度
	 */
	function lingqu(_bindmobile,_lqCount) {
		var _oSend = {
			action: 31006,
			merid: "applogin",
			bizcode: "qiang.lingqu",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({userid:userid,pid:pid,lqCount:_lqCount,mobile:_bindmobile})
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if (oData.BINDATA.data.errno!='0') {
				alert(oData.BINDATA.data.msg);
			}else {
				alert('领取成功');
				action10061('/zsjy/jiangping.html');
			}
		});
	}
	window.GoBackOnLoad = function () {
        oTools.readMapMesg(['isnormallogin','userid','bindmobile'], function (oData) {
    		if (oData.ISNORMALLOGIN != '1') {
    			changeURL("http://action:10090/?loginkind=0&&jsfuncname=GoBackOnLoad()");
//    			action10061('/zsjy/login.html');
    		} else {
        	    userid = oData.USERID;
    			if (oData.BINDMOBILE) {
    				$('#shouji').html(oData.BINDMOBILE);
    			}
    			getaccountinfo();
    		}
        })
    }
});