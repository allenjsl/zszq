/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function(require, exports, module) {
	var $ = require('$');
	var TZT = new (require('tzt'))($);
//	var not = require('rednot');
	var oTools = TZT.TOOLS;
	var V = '1.0', userid = '', fundid = '', custid = '', username = '', mobileno = '',realname='';
	$(function() {
		init();
	});
	function init() {
		GoBackOnLoad();
		pageEvent();
		oTools.iscroll('#wrapper');
	}

	function pageEvent() {
		//信用开户
//		$('.xinyong').on('click', function() {
//    		changeURL("/zsjy/xykh.html");
//		})
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
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if(!oData.BINDATA.data) {
				return;
			}
			if (oData.BINDATA.data.errno != "0") {
				alert(oData.BINDATA.data.msg);
			}
			else {
				if (oData.BINDATA.data.dataset.url.length>0) {
					$('.touxiang').attr('src', oData.BINDATA.data.dataset.url);
				}
			}
		});
	}
    //获取个人信息
    function searchKHGDZH(fn) {
        var oSend = {
            action:46148,
            func: 'searchKHGDZH',
            fundAccount:fundid
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var aItem = oData.GRID4[0].split('|');
            $('.shouji').html(aItem[0]);
            $('.yingyebu').html(aItem[1]);

            $.each(oData.GRID2, function (i, item) {
                var aItemacc = item.split('|');
                //深圳市场
                if (aItemacc[0] == '0') {
                    //股东账户
                    if (aItemacc[2] == '0') {
                        $('#shenzhen').html(aItemacc[1]);
                    }
                        //两融
                    else {

                    }
                }
                    //上海市场  
                else {
                    //股东账户
                    if (aItemacc[2] == '0') {
                        $('#shanghai').html(aItemacc[1]);
                    }
                        //两融
                    else {

                    }
                }

            });
            $.each(oData.GRID3, function (i, item) {
                var aItemzj = item.split('|');
                //资金账号
                if (aItemzj[1] == '0') {
                    $('.zijinzhanghao').html(aItemzj[0]);
                }
                    //信用账号
                else {
                    $('.xyzh').html(aItemzj[0]);
                }
            });
        });
    }
	window.GoBackOnLoad = function () {
		oTools.readMapMesg(['isnormallogin', 'userid', 'fundid', 'custid', 'username','realname', 'mobileno'], function(oData) {
    		if (oData.ISNORMALLOGIN != '1') {
    			changeURL("http://action:10090/?loginkind=0&&jsfuncname=GoBackOnLoad()");
//    			action10061('/zsjy/login.html');
    		} else {
    			userid = oData.USERID;
    			fundid = oData.FUNDID;
    			custid = oData.CUSTID;
    			username = oData.USERNAME;
    			realname = oData.REALNAME;
    			if (fundid) {
    			$('.xingming').html(realname);
    			} else {
    			$('.xingming').html(username);
    			}
    			mobileno = oData.MOBILENO;
    			gettouxiang();
    			if (fundid) {
    				searchKHGDZH();
    			}
    		}
		});
    }
});