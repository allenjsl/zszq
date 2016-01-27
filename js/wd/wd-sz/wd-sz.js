/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
//tztuserstocksyn	自选股同步	全部	ALL	自选股云同步开关 1-使用 0-不使用
//tzttradestockshow	个股持仓显示	全部	ALL	个股持仓显示 1-显示 0-不显示
//tztcachesize	缓存文件大小	全部	ALL	缓存文件大小
//tztautopushmsg  云推送 1-推送  0-不推送
//
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var dialog = TZT.dialog;
    var j_zxg = $('.j_zxg');
    var j_ggcc = $('.j_ggcc');
    var j_ggxx = $('.j_ggxx');
	var j_lxyd = $('.j_lxyd');
    var upurl = '';
    var version = '';
    $(function () {
        init();
    });
    function init() {
        getSet();
        pageEvent();
        oTools.iscroll('#wrapper');
        update();
    }
    function pageEvent() {
        //修改密码入口
        $('.j_changepwd').on('click', function () {
            gochangeURL('/zsjy/app/wd/wd-sz/sz-xgmm/sz-xgmm.html');
        });
        //是否清除缓存
        $('.j_clear').on('click', function () {
            if (confirm('是否清除缓存?')) {
                changeURL('http://action:10074/?clearAll=1&&jsfuncname=getSet()');
            }
            //dialog.open($('.j_isclear'));
        });
        //清除缓存
        $('.j_goclear').on('click', function () {
            //dialog.close();
        });
        //不清除
        $('.j_noclear').on('click', function () {
            dialog.close();
        });
        //免责条款
        $('.j_mztk').on('click', function () {
            action10061('/zsjy/app/wd/wd-sz/sz-mzsm/sz-mzsm.html');
        });
        //意见反馈
        $('.j_yjfk').on('click', function () {
            action10061('/zsjy/app/wd/wd-sz/sz-yjfk/sz-yjfk.html');
        });
        //版本信息
        $('.j_bbxx').on('click', function () {
            if (upurl) {
                changeURL(upurl);
            }
            else {
                action10061('/zsjy/version.html?version=' + version);
            }
        });
        //自选股云同步
        j_zxg.on('click', function () {
            $(this).toggleClass('on');
            //默认关闭
            var _tztuserstocksyn=0;
            if ($(this).hasClass('on')) {
                _tztuserstocksyn=1;
            }
            oTools.setLocalMesg({ tztuserstocksyn: _tztuserstocksyn }, function () { });
        });
        //公共信息推送
        j_ggxx.on('click', function () {
            $(this).toggleClass('on');
            //默认关闭
            var _tztautopushmsg = 0;
            if ($(this).hasClass('on')) {
                _tztautopushmsg = 1;
            }
            oTools.setLocalMesg({ tztautopushmsg: _tztautopushmsg }, function () { });
        });
        //离线阅读
        j_lxyd.on('click', function () {
            $(this).toggleClass('on');
        	//默认关闭
            var _tztofflineread = 0;
            if ($(this).hasClass('on')) {
                _tztofflineread = 1;
            }
            oTools.setLocalMesg({ tztofflineread: _tztofflineread }, function () { });
        });
        //服务器设置
        $('.j_fwqsz').on('click', function () {
            action10061('http://action:10311/?');
        });
        //个股持仓显示
        j_ggcc.on('click', function () {
            $(this).toggleClass('on');
            //默认关闭
            var _tzttradestockshow = 0;
            if ($(this).hasClass('on')) {
                _tzttradestockshow = 1;
            }
            oTools.setLocalMesg({ tzttradestockshow: _tzttradestockshow }, function () { });
        });
    }
    //读取设置信息
    window.getSet = function () {
        oTools.getLocalMesg(['tztuserstocksyn', 'tzttradestockshow', 'tztcachesize','tztautopushmsg','tztofflineread'], function (oData) {
            //缓存大小
            var cachesize = oData.TZTCACHESIZE;
            //自选股云同步
            var userstocksyn = oData.TZTUSERSTOCKSYN;
            //个股持仓显示
            var tradestockshow = oData.TZTTRADESTOCKSHOW;
            //云推送
            var autopushmsg = oData.TZTAUTOPUSHMSG;
        	//离线阅读
        	var offlineread = oData.TZTOFFLINEREAD;
            $('.j_cachesize').html(cachesize + 'MB');
            if (userstocksyn == '0') {
                j_zxg.addClass('onoff off');
            }
            else {
                j_zxg.addClass('onoff off on');
            }
            if (tradestockshow == '0') {
                j_ggcc.addClass('onoff off');
            }
            else {
                j_ggcc.addClass('onoff off on');
            }
            if (autopushmsg == '0') {
                j_ggxx.addClass('onoff off');
            }
            else {
                j_ggxx.addClass('onoff off on');
            }
        	if (offlineread=='0') {
        		j_lxyd.addClass('onoff off');
        	} else {
        		j_lxyd.addClass('onoff off on');
        	}
        });
    }
    function update() {
        var sUpversion = '';
        //从客户端获取内部版本号
        oTools.getLocalMesg(["upversion"], function (oData) {
            var sThisVersion = oData.UPVERSION;
            version = sThisVersion;
            $('.j_bbxxc').html(sThisVersion);
            if (sThisVersion == null || sThisVersion == '') {
                alert("检查版本出错，建议下载最新客户端！"); return false;
            } else {
                sUpversion = sThisVersion;
                TZT.getData('/reqxml' + encodeURI('?action=2&ReqlinkType=3&version=' + sUpversion + '&Tfrom=($Tfrom)'), '', function (oData) {
                    if (oData.ERRORNO != 0) {
                        var sUpdateURL = null;
                        if (window.navigator.appVersion.indexOf("android") > 0 && (sThisVersion == '2.0.0' || sThisVersion == '2.0.1')) {
                            sUpdateURL = oData.ERRORMESSAGE; //attractive
                        } else {
                            sUpdateURL = 'http://action:10330?url=' + oData.ERRORMESSAGE; //attractive	
                        }
                        if (oData.VERSION != undefined) {
                            upurl = sUpdateURL;
                            $('.j_bbxxc').html('发现新版本');
                            if (confirm("发现新版本，是否更新？")) {
                                changeURL(sUpdateURL);
                            }
                        } else {
                            //alert("当前版本已经是最新版本！");
                        }
                        return false;
                    } else {
                        //alert("当前版本已经是最新版本！");
                    }
                })
            }
        });
    }
});