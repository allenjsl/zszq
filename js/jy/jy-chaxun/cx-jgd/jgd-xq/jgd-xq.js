/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    //读取缓存中存在的交割单信息
    var oCache = {};
    var sContract = '';
    //交割单最大条数
    var maxcount = 0;
    //当前条数
    var current = 0;
    $(function () {
        init();
    });
    function init() {
        sContract = TZT.getUrlParameter('contract');
        oTools.setHeight($('#wrapper'), 49);
        oTools.readMapMesg(['jgddata'], function (oData) {
            oCache = JSON.parse(oData.JGDDATA);
            maxcount = oCache.length-1;
            current = (+sContract)-1; //oCache[sContract].number;
            getJGD(current);
            pageEvent();
            myScroll = oTools.iscroll('#wrapper');
        });
    }
    //页面数据绑定
    function pageEvent() {
        //前一个
        $('.j_pre').on('click', function () {
            if (current == 0) {
                current = maxcount;
            }
            else {
                current = current - 1;
            }
            var sCurrent=current;
            //var contract_id = oCache[sCurrent];
            getJGD(sCurrent);
        });
        //后一个
        $('.j_next').on('click', function () {
            if (current == maxcount) {
                current = 0;
            }
            else {
                current = current + 1;
            }
            var sCurrent = current;
            //var contract_id = oCache[sCurrent];
            getJGD(sCurrent);
        });
    }
    function getJGD(contractid) {
        var oJGD = oCache[contractid];
        //交收日期
        $('.j_jsrq').html(oJGD.jsdate);
        //证券代码
        $('.j_stockcode').html(oJGD.stockcode);
        //证券名称
        $('.j_stockname').html(oJGD.stockname);
        //买卖标志
        $('.j_buytype').html(oJGD.buytype);
        //成交价格
        $('.j_cjjg').html(oJGD.cjprice);
        //成交数量
        $('.j_cjsl').html(oJGD.cjcount);
        //成交金额
        $('.j_cjje').html(oJGD.cjmoney);
        //发生金额
        $('.j_fsje').html(oJGD.fsmoney);
        //净佣金(标准手续费)
        $('.j_jyj').html(oJGD.jyj);
        //印花税
        $('.j_yhs').html(oJGD.yhs);
        //交易规费
        $('.j_jygf').html(oJGD.jygf);
        //过户费
        $('.j_ghf').html(oJGD.ghf);
        //其他费
        $('.j_qtf').html(oJGD.qtf);
        //合同编号
        $('.j_contract').html(oJGD.contract);
    }
});