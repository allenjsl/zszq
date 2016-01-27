define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
	var V = '1.0';
    $(function () {
        init();
    });
    function init() {
        pageEvent();
        oTools.iscroll('#wrapper');
    }
    function pageEvent() {
    	//修改资料
    	$("#xgzl").on("click",function () {
    		changeURL("/zsjy/xgzl.html");
    	})
    	//更换手机号码
    	$("#ghsj").on("click",function () {
    		changeURL("/zsjy/ghsj.html");
    	})
    	//风险测评
    	$("#fxpg").on("click",function () {
    		changeURL("/zsjy/fxpg.html");
    	})
    	//账户管理
    	$("#zhgl").on("click",function () {
    		changeURL("/zsjy/zhgl.html");
    	})
    	//修改交易密码
    	$("#jjmm").on("click",function () {
            gochangeURL('/zsjy/app/wd/wd-sz/sz-xgmm/sz-xgmm.html');
    	})
    	//修改委托方式
        $('#wtfs').on('click', function () {
    		changeURL("/zsjy/wtfs.html");
        });
    	//开通风险警示版
        $('#fxjs').on('click', function () {
    		changeURL("/zsjy/fxjs.html");
        });
    	//转签创业板
        $('#zqcy').on('click', function () {
    		changeURL("/zsjy/zqcy.html");
        });
    	//开通创业板（攻略）
        $('#ktcy').on('click', function () {
    		changeURL("/zsjy/ktcy.html");
        });
    	//重置密码
        $('#czmm').on('click', function () {
    		changeURL("/zsjy/czmm.html");
        });
    }
});