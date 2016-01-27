/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTool = TZT.TOOLS;
    $(function () {
        init();
    });
    function init() {
        oTool.getLocalMesg(['UserName'], function (oData) {
            $('.j_username').html(oData.USERNAME);
            searchKHGDZH();
        });
    }
    //获取个人信息
    function searchKHGDZH(fn) {
        var oSend = {
            action:46148,
            func: 'searchKHGDZH',
            fundAccount:'($account)'
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            var aItem = oData.GRID4[0].split('|');
            $('.j_phone').html(aItem[0]);
            $('.j_addr').html(aItem[1]);

            $.each(oData.GRID2, function (i, item) {
                var aItemacc = item.split('|');
                //深圳市场
                if (aItemacc[0] == '0') {
                    //股东账户
                    if (aItemacc[2] == '0') {
                        $('.j_szgd').html(aItemacc[1]);
                    }
                        //两融
                    else {

                    }
                }
                    //上海市场  
                else {
                    //股东账户
                    if (aItemacc[2] == '0') {
                        $('.j_shgd').html(aItemacc[1]);
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
                    $('.j_zjzh').html(aItemzj[0]);
                }
                    //信用账号
                else {
                    $('.j_xyzh').html(aItemzj[0]);
                }
            });
        });
    }
});