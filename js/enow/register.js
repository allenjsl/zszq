define(function(require, exports, module) {
	var $ = require('$');
	var TZT = new (require('tzt'))($);
	var oTools = TZT.TOOLS;
	var mobileno = "";
	var v = 1.0;
	
	$(function () {
		init();
		pageEvent();
//        oTools.iscroll('#wrapper');
	})

	function init() {
		oTools.readMapMesg(["mobileno"], function(oData) {
			mobileno = oData.MOBILENO;
		});
	}
	function pageEvent() {
		$("#register").on("click", function() {
			var _username = $("#username").val();
			var _password = $("#password").val();
			var _confirmpw = $("#confirmpw").val();

			if (_username.length == 0) {
				alert("请设置用户名");
				return false;
			}
			if (_username.length<3||_username.length>11||/^[\u4e00-\u9fa5]+$/i.test(_username)||YanZheng(_username)) {
				alert('请设置3到11包含数字、字母、下划线的用户名');
				return false;
			}
			if (_password.length == 0) {
				alert("请设置密码");
				return false;
			}
			if (_confirmpw.length == 0) {
				alert("请确认密码");
				return false;
			}
			if (_password != _confirmpw) {
				alert("密码不一致");
				return false;
			}
			register(_username, _password, _confirmpw);
		});
	}
	function YanZheng(s)
	{
		var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
		return pattern.test(s);
	}
	function register(_username,_password,_confirmpw) {
		var _oSend = {
			action: 31004,
			merid: "applogin",
			bizcode: "app.register",
			timestamp: TZT.TAG,
			req_id: Math.random(),
			v: v,
			charset: "utf-8",
			sign_type: "rsa",
			format: "json",
			data: JSON.stringify({username:_username,password:_password,confirmpw:_confirmpw,mobile:mobileno})
		};
		TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
			oData.BINDATA = JSON.parse(oData.BINDATA);
			if (oData.BINDATA.state!='0') {
				alert(oData.BINDATA.message);
				return;
			}
			oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
			if (oData.BINDATA.data.errno != "0") {
				alert(oData.BINDATA.data.msg);
			}
			else {
				//普通登录
				_oSend.bizcode = "app.login";
				_oSend.data.usertype = 1;
				TZT.getData(TZT.REQ.XML, _oSend, function(oData) {
					oData.BINDATA = JSON.parse(oData.BINDATA);
					oData.BINDATA.data = JSON.parse(oData.BINDATA.data);
					if (oData.BINDATA.data.errno != "0") {
						alert(oData.BINDATA.data.msg);
					}
					else {
						oTools.saveMapMesg({
								userid: oData.BINDATA.data.dataset[0].userid,
								username: oData.BINDATA.data.dataset[0].username,
								usertype: oData.BINDATA.data.dataset[0].usertype,
								fundid: oData.BINDATA.data.dataset[0].fundid,
								custid: oData.BINDATA.data.dataset[0].custid,
								isnormallogin: 1
							}, function() {
								action10002();
							});
					}
				});
			}
		});
	}
});