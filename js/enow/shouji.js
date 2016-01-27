define(function(require, exports, module) {
	var $ = require('$');
	var TZT = new (require('tzt'))($);
	var oTools = TZT.TOOLS;
	var checkcode = "";
	var diff = 60;
	var clearid = null;

	$(function() {
		init();
		pageEvent();
//		oTools.iscroll('#wrapper');
	});

	function init() {
		oTools.readMapMesg(["bindmobile"], function(oData) {
			$("#mobileno").val(oData.BINDMOBILE);
		});
	}
	function pageEvent() {
		$(".duanxin_code").on("click", function() { getcheckcode(diff,$("#mobileno").val(),this); });
		$("#btnTiJiao").on("click", function() {
			var _checkcode = $('#checkcode').val();
			if (_checkcode.length == 0) {
				alert("请输入验证码");
				return false;
			}
//			oTools.readMapMesg(["mobileno"], function(oData) {
//				var _oSend = {
//					Action: 44051,
//					Checkkey: _checkcode,
//					MobileCode: oData.MOBILENO
//				};
//				TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
//					if (oData.ERRORNO != "0") {
//						alert(oData.ERRORMESSAGE);
//					}
//					else {
//						action10061("/zsjy/register.html");
//					}
//				});
//			});
			if (_checkcode != checkcode) {
				alert("请输入正确的验证码");
				return false;
			}
			action10002();
		});
	}
	function getcheckcode(_diff,_mobileno,_o) {
		if (_mobileno.length==0) {
			alert('请输入手机号码');
			return false;
		}
		if (!TZT.REG.PHONE.test(_mobileno)) {
			alert('请输入正确的手机号码');
			return false;
		}
			$(_o).unbind();
			$(_o).css("background", "gray");
		var _oSend = {
			Action: 44050,
			MobileCode: _mobileno
		};

		TZT.getData(TZT.REQ.XML,_oSend,function (oData) {
			if (oData.ERRORNO!="0") {
				alert(oData.ERRORMESSAGE);
			}
			else {
				checkcode = oData.CHECKKEY;
				oTools.saveMapMesg({ bindmobile: _mobileno }, function() { timer(_diff,_o);});
			}
		});
	}
	function timer(_diff,_o) {
		clearid = setInterval(function() {
			if (_diff <= 0) {
				clearInterval(clearid);
				$(_o).on("click", function() {
					getcheckcode(diff,$("#mobileno").val(),_o);
				})
				$(_o).css("background", "#e55126");
				$(_o).html("获取验证码");
				return false;
			}
			$(_o).html((_diff<10?'0':'')+_diff + "秒后获取");
			_diff--;
		}, 1000);	
	}
});