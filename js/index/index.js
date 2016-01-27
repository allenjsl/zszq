/// <reference path="../../lib/jquery/jquery.js" />
/// <reference path="../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
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
        var slider = slide($('#d-slide')[0], {
            auto: 3000,
            continuous: true,
            callback: function (pos) {
                if (pos == 2) { pos = 0; }
                if (pos == 3) { pos = 1; }
                $('#J_position li').eq(pos).addClass('on').siblings().removeClass();
            }
        })
        pageEvent();
        oTools.iscroll('#wrapper');
        oTools.getLocalMesg(['tztbadgenumber'], function (oData) {
            if (+oData.TZTBADGENUMBER > 0) {
                //10071
                changeURL('http://action:1901/?tab5=' + 1);
            }
        })
    }
    function pageEvent() {
        $('.j_banner1').on('click', function () {
            action10061('http://www.zszq.com/wd/html/activity/father/fuqinjie.html');

        });
        $('.j_banner2').on('click', function () {
            openacc();

        });
        $('.j_banner3').on('click', function () {
            action10061('http://landing.zszq.com/pkactive/view/qry-allinfos;jsessionid=D2CE924A79F062E19AF492DC1D52B58E');

        });
        $('.j_xjt').on('click', function () {
            gotoxjt();
        });
        $('.j_rxt').on('click', function () {
            action10073(oConfig.rxtappurl, oConfig.rxtactivityurl, oConfig.rxtdownloadurl);
        });
    }
});