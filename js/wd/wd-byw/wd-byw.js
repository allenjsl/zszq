/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    //配置信息
    var oConfig = TZT.TOOLS.config;
    $(function () {
        init();
    });
    function init() {
        pageEvent();
        /*oTools.getauthority(function (s) {
            if (s == '1') {
                $('.j_xjtkt').html('已开通');
            }
            else {
                $('.j_xjtkt').html('未开通');
            }
        });*/
    }//(/android/i).test(navigator.appVersion)
    function pageEvent() {
        //现金通
        $('.j_xjt').on('click', function () {
            oTools.savexjtck(function () {
                gotoxjt();
            });
        });
        //开户
        $('.j_openaccount').on('click', function () {
        	if (TZT.DEVICE.ISANDROID) {
                changeURL('http://action:10073/?appurl='+encodeURIComponent('com.thinkive.mobile.account_zhongshan')+'&&opentype=2&&activityurl='+encodeURIComponent('com.zhongshan.video.activitys.HomeActivity')+'&&content='+encodeURIComponent('是否下载中山手机开户软件?')+'&&downloadurl='+encodeURIComponent( 'http://113.107.238.16/dd.myapp.com/16891/56AA49E88ADF90D2BFD2EA3336713F0F.apk?mkey=55daebb1fd81298c&f=d388&fsname=com.thinkive.mobile.account_zhongshan_1.0.1_1.apk&asr=02f1&p=.apk'));
        	} else {
                openacc();
        	}
        });
        //融新通
        $('.j_rxt').on('click', function () {
            action10073(oConfig.rxtappurl, oConfig.rxtactivityurl, oConfig.rxtdownloadurl);
        });
    }
});