/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
	var V = '1.0';
	var clearid = null;
    //配置信息
    var oConfig = oTools.config;
    $(function () {
        //oTools.readMapMesg(['tztalert'], function (oRead) {
        //    if (oRead.TZTALERT == '1') { return; }
        //    oTools.saveMapMesg({ tztalert: 1 }, function () {
        //        var content = '尊敬的用户，您好!\r\n中山证券将于4月24日下午17:00起进行系统升级，预计4月26日下午19:00完成。此时间段内将无法登录小鹿金融App。\r\n给您带来的不便，我们感到万分抱歉!~';
        //        alert(content);
        //    });
        //});http://www.zszq.com/
        //var aRR = [];
        //aRR.push('尊敬的用户，您好！\r\n\r\n中山证券将于6月5号下午17：00起进行系统升级，预计6月6号晚上24：00完成，此时间段内将无法登录小鹿金融App。\r\n\r\n给您带来的不便，我们感到万分抱歉！~');
        //alert(aRR.join(''));
        iosupdate();
        init();
    });
	function iosupdate() {
        if (TZT.DEVICE.ISIOS) {
            //从客户端获取内部版本号
            oTools.getLocalMesg(["upversion"], function (oData) {
            	var sThisVersion = oData.UPVERSION;
                if (sThisVersion == '1.01.001') {
                    var oSend = {
                        action: 2,
                        ReqlinkType: 3,
                        version: sThisVersion,
                        Tfrom: '($Tfrom)'
                    };
                    TZT.getData('/reqxml?', oSend, function (oData) {
                        if (oData.ERRORNO != 0) {
                            var sUpdateURL = 'http://action:10330?url=' + encodeURIComponent(oData.UPDATEADDR); //attractive	
                            //建议升级
                            if (oData.UPDATESIGN == '1') {
                                if (confirm(oData.ERRORMESSAGE)) {
                                    changeURL('http://action:10073/?opentype=2&&appurl=' + encodeURIComponent('12312') + '&&activityurl=' + encodeURIComponent('12312') + '&&downloadurl=' + encodeURIComponent(oData.UPDATEADDR));
                                }
                                else {
                                    
                                }
                            }
                                //强制升级
                            else {
                                if (confirm(oData.ERRORMESSAGE)) {
                                    changeURL('http://action:10073/?opentype=2&&appurl=' + encodeURIComponent('2123123') + '&&activityurl=' + encodeURIComponent('12313') + '&&downloadurl=' + encodeURIComponent(oData.UPDATEADDR));
                                    iosupdate();
                                }
                                else {
                                    iosupdate();
                                }
                            }
                                
                        }
                    });
                }
            });
        }
    }
    function init() {
	    banner();
        bannerActiv();
        bannerXjlc();
        pageEvent();
//        oTools.getLocalMesg(['tztbadgenumber'], function (oData) {
//            if (+oData.TZTBADGENUMBER > 0) {
//                //10071
//                changeURL('http://action:1901/?tab5=' + 1);
//            }
//        })
    	getshouyi();
    	GetMiaoShaChangCi();
    	var _height = ($(window).height() - 112) / 4;
    	$('.cell-list,.cell-func').css('height', _height);
    	$('.swipe-activity,.activity-wrap').css('height', _height * 2);
    	$('.pos-right-jy').css('top', _height + 113);
    	$('.pos-right-hq').css('top', 113);
        oTools.iscroll('#index-wrap');
    }
    function pageEvent() {
    	//12002
    	$("#hq").on("click",function () {
    		action10061("http://action:12002/?");
    	})
    	//12250
    	$("#jy").on("click",function () {
    		action10061("http://action:12250/?");
    	})
    	$("#wyzq").on("click",function () {
    		action10061("/zsjy/wyzq.html");
    	})
    	$("#wsyyt").on("click",function () {
    		action10061("/zsjy/yyt.html");
    	})
    	$("#wytc").on("click",function () {
//    		oTools.readMapMesg(['isnormallogin'], function(oData) {
//    			if (oData.ISNORMALLOGIN == '1') {
    				action10061("/zsjy/wytc.html");
//    			} else {
//    				action10061("/zsjy/login.html");
//    			}
//    		});
    	})
        $('.j_banner1').on('click', function () {
            action10061('http://www.zszq.com/wd/html/activity/father/fuqinjie.html');

        });
        $('#wykh').on('click', function () {
        	if (TZT.DEVICE.ISANDROID) {
                changeURL('http://action:10073/?appurl='+encodeURIComponent('com.thinkive.mobile.account_zhongshan')+'&&opentype=2&&activityurl='+encodeURIComponent('com.zhongshan.video.activitys.HomeActivity')+'&&content='+encodeURIComponent('是否下载中山手机开户软件?')+'&&downloadurl='+encodeURIComponent( 'http://113.107.238.16/dd.myapp.com/16891/56AA49E88ADF90D2BFD2EA3336713F0F.apk?mkey=55daebb1fd81298c&f=d388&fsname=com.thinkive.mobile.account_zhongshan_1.0.1_1.apk&asr=02f1&p=.apk'));
        	} else {
                openacc();
        	}
        });
        $('.j_banner3').on('click', function () {
            action10061('http://landing.zszq.com/pkactive/view/qry-allinfos;jsessionid=D2CE924A79F062E19AF492DC1D52B58E');

        });
        $('.xjlc').on('click', function () {
            gotoxjt();
        });
        $('#wyjq').on('click', function () {
            action10073(oConfig.rxtappurl, oConfig.rxtactivityurl, oConfig.rxtdownloadurl);
        });
    	$('.count-bnt').on('click',function () {
    		alert('敬请期待');
    	})
    	$('.bg-syl-val').on('click',function () {
            gotoxjt();    		
    	})
    }
	/**
	 * 现金通七日年化收益率
	 *
	 */
	function getshouyi() {		
//		$.ajax({
//				url: 'http://zx.zszq.com/query-seven-income-app',
//				dataType: 'jsonp',
//				jsonp: 'callback',
//				success: function(json) {
//					alert(JSON.stringify(json));
//					$('#shouyi').html(json.data);
//				}
//			});
		
//		$.getJSON('http://zx.zszq.com/query-seven-income-app?callback=jsonpcallback',function (result) {
//			$('#shouyi').html(result.data);
//		})
		
		TZT.getData('http://zx.zszq.com/query-seven-income-app', function(oData) {
			$('#shouyi').html(oData.data);
		});
	}
	/*
	* @intention 首页banner图片滑动切换
	*/
    function banner() {
        var slider = slide(document.getElementById('J_slider'), {
            auto: 3000,
            continuous: true,
            callback: function(pos){
                $("#J_position li").eq(pos).addClass("on").siblings().removeClass();
            }
        });
    }
    
    /*
    * @intention 话费龙虎榜/秒杀活动滑动切换
    */
    function bannerActiv() {
		var _oSend = {
			action: 31006,
			merid: "applogin",
			bizcode: "qiang.scoreInfo",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: '{}'
		};

    	TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
    		var sDom = '';
    		oData.BINDATA = JSON.parse(oData.BINDATA);
    		oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
    		$.each(oData.BINDATA.data.dataset, function(i, item) {
    			sDom += '<li class="tel-item">' +
	    			'	<span class="tel-index">' + item.rowNo + '</span>' +
		    			'	<span class="tel-no">' + item.userName + '</span>' +
			    			'	<span class="tel-fee"><i class="tel-val">' + item.totalCount + '</i>元</span>' +
				    			'</li>';
    		});
    		$('.tel-rank').html(sDom);
    		//龙虎榜轮播
//    		if (sDom) {
//    			var _myScroll = oTools.iscroll('#scroller');
//    			var _timer;
//    			var _i = 0;
//    			var _obj = $('#scroller');
//    			var _gund = function() {
//    				_i++;
//    				if (_i == _obj.height()) {
//    					_i = 0;
//    				}
//    				_myScroll.scrollTo(0, 0-_i);
//    			};
//    			_timer = setInterval(_gund, 100);
//    		}
    	});
        var slider = slide(document.getElementById('J_activity'), {
            auto: 5000,
            continuous: true,
            mode: "horizental"
        });
    }

    /*
    * @intention 现金理财/收益率滑动切换
    */
    function bannerXjlc() {
        var slider = slide(document.getElementById('J_syl'), {
            auto: 3000,
            continuous: true,
            callback: function(pos){
            }
        });
    }
	/**
	 * 获取最近秒杀场次
	 */
	function GetMiaoShaChangCi() {
		var _oSend = {
			action: 31006,
			merid: "applogin",
			bizcode: "qiang.huodongInfo",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: V,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: '{}'
		};

		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			//判断秒杀活动是否过时
			if (oData.BINDATA.data.dataset.disMis > 0) {
				$('.activity-title span').html(oData.BINDATA.data.dataset.remark); //subject
				$('.count-cnt p').html(oData.BINDATA.data.dataset.display);
				timer((oData.BINDATA.data.dataset.disMis/1000).toFixed(0), $('.count-cnt p'));
			} else {
				$('.count-cnt p').html('秒杀已结束');
			}
		});
	}
	/**
	 * 计时器
	 *
	 */
	function timer(_diff,_o) {
		clearid = setInterval(function() {
			if (_diff <= 0) {
				clearInterval(clearid);
				$(_o).html('秒杀已结束');
				return false;
			}
			var _times = $(_o).html().split(':');
			var _h = parseInt(_times[0]);
			var _m = parseInt(_times[1]);
			var _s = parseInt(_times[2]);

			if (_s<=0) {
				_m--;
				if (_m<=0) {
					_h--;
					if (_h<=0) {
						_h = 0;
					} else {
						_m = 59;
					}
				}
				else {
					_s = 59;
				}
			}
			else {
				_s--;
			}
			$(_o).html((_h < 10 ? ('0' + _h) : _h) + ':' + (_m < 10 ? ('0' + _m) : _m) + ':' + (_s < 10 ? ('0' + _s) : _s));
			_diff--;
		}, 1000);	
	}
	window.GoBackOnLoad = function () {
		bannerActiv();
		GetMiaoShaChangCi();getshouyi();
	}
});