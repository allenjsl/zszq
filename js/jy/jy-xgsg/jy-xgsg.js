/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var not = require('rednot');
    //配置信息
    var oConfig = TZT.TOOLS.config;
    $(function () {
        init();
    });
    function init() {
        //如果有新股显示用点
        not.isread(function (type) {
            if (type) {
                $('.j_redico').addClass('circle');
            }
            else {
                $('.j_redico').removeClass('circle');
            }
        });
        pageEvent();
    }
    function pageEvent() {
        //新股申购入口
        $('.j_xgsg').on('click', function () {
            //action10061('/zsjy/app/jy/jy-xgsg/sg-xgsg/sg-xgsg.html');
            changeURL('http://action:10061/?secondtype=99&&secondtext=借钱打新&&fullscreen=1&&firsttype=10&&secondurl=' + encodeURIComponent('http://action:10073/?opentype=2&&appurl=' + oConfig.rxtappurl + '&&activityurl=' + oConfig.rxtactivityurl + '&&content=' + encodeURIComponent('是否下载小融通?') + '&&downloadurl=' +  encodeURIComponent( oConfig.rxtdownloadurl)) + '&&url=' + encodeURIComponent('/zsjy/app/jy/jy-xgsg/sg-xgsg/sg-xgsg.html'));
        });
        //借钱打新入口
        $('.j_jqdx').on('click', function () {
            //点击后去除红点
            not.removenot(function () {
                $('.j_redico').removeClass('circle');
                action10073(oConfig.rxtappurl, oConfig.rxtactivityurl, oConfig.rxtdownloadurl);
            });
        });
        //新股日历入口
        $('.j_xgrl').on('click', function () {
            action10061('/zsjy/app/jy/jy-xgsg/sg-xgrl/sg-xgrl.html');
        });
        //新股可申购额度入口
        $('.j_xgksged').on('click', function () {
            action10061('/zsjy/app/jy/jy-xgsg/sg-ksged/sg-ksged.html');
        });
        //新股配号入口
        $('.j_xgph').on('click', function () {
            action10061('/zsjy/app/jy/jy-xgsg/xgph/xgph.html');
        });
        //新股中签入口
        $('.j_xgzq').on('click', function () {
            action10061('/zsjy/app/jy/jy-xgsg/sg-xgzq/sg-xgzq.html');
        });
        //申购明细入口
        $('.j_sgmx').on('click', function () {
            action10061('/zsjy/app/jy/jy-xgsg/sg-sgmx/sg-sgmx.html');
        });
    }
    //是否有新股
    function action46106() {
        var oSend = {
            action: 46106,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            nPage: nCount,
            maxcount: 10
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            if (oData.GRID3) {
                TZT.TOOLS.readFileMesg('tzt_xgsg', function (oData) {
                    var nowday = new Date().getDate();
                    if (oData.xgsg != nowday) {
                       
                    }
                });
            }
        });
    }
});