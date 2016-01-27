/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var not = require('rednot');
    var oTools = TZT.TOOLS;
    $(function () {
        init();
    });
    function init() {
        pageEvent();
        oTools.iscroll('#wrapper');
        GoBackOnLoad();
    }
    function pageEvent() {
        //撤单入口
        $('.j_chedan').on('click', function () {
            action12340();
        });
        //持仓入口
        $('.j_chicang').on('click', function () {
            action12342();
        });
        //查询入口
        $('.j_chaxun').on('click', function () {
            action12303();
        });
        //买入入口
        $('.j_buy').on('click', function () {
            action12310();
        });
        //卖出入口
        $('.j_sale').on('click', function () {
            action12311();
        });
        //银证转账入口
        $('.j_yzzz').on('click', function () {
            action12330();//12302
        });
        //融资融券入口
        $('.j_rzrq').on('click', function () {
            action15001();
        });
        //打新股入口
        $('.j_dxg').on('click', function () {
            gochangeURL('/zsjy/app/jy/jy-xgsg/jy-xgsg.html');
        });
        //好产品入口
        $('.j_hcp').on('click', function () {
            alert('敬请期待');
        });
        //个股期权入口
        $('.j_ggqq').on('click', function () {
            alert('敬请期待');
        });
        //现金通入口
        $('.j_xjt').on('click', function () {
            oTools.savexjtck(function () {
                gotoxjt();
            });
        });
    }
    window.GoBackOnLoad = function () {
        oTools.getLocalMesg(['jyloginflag'], function (oData) {
            if (oData.JYLOGINFLAG == '0' || oData.JYLOGINFLAG=='1') { return; }
            //是否显示现金通收益红点
            oTools.isshowxjtsy(function (type2) {
                //如果有新股显示用点
                not.isread(function (type) {
                    if (type) {
                        $('.j_redico').addClass('new-info');
                        tztsetrednot('32');
                    }
                    else {
                        if (!type2) {
                            action1901tab4('0');
                        }
                        $('.j_redico').removeClass('new-info');
                    }
                });
            });
        })
    }
})