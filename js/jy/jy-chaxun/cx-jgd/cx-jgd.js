/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var slide = require('slide');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    //缓存页面数据
    var oCache = [];
    var j_jgdlist = $('.j_jgdlist');
    var myScroll;
    var nMaxCount = 1;
    //url传参
    var urlParam = {
        begindate: '',
        enddate:''
    };
    $(function () {
        init();
    });
    function init() {
        urlParam.begindate = TZT.getUrlParameter('begindate');
        urlParam.enddate = TZT.getUrlParameter('enddate');
        oTools.setHeight($('#wrapper'), 40);
        action121(nMaxCount);
        pageEvent();
        myScroll = oTools.iscroll('#wrapper', function (type, fn) {
            if (type == 'more') {
                nMaxCount += 10;
                action121(nMaxCount, 'more', fn);
            }
            else {
                nMaxCount = 1;
                action121(nMaxCount, '', fn);
            }
        });
    }
    function pageEvent() {
        j_jgdlist.delegate('.item', 'click', function () {
            var nindex = $(this).attr('data-jgd');
            action10061('/zsjy/app/jy/jy-chaxun/cx-jgd/jgd-xq/jgd-xq.html?contract=' + nindex);
        });
    }
    function action121(nCount, type, fn) {
        var oSend = {
            action: 121,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            StartPos: nCount,
            MaxCount: 10,
            BeginDate: urlParam.begindate,
            EndDate: urlParam.enddate        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            if (oData.ERRORMESSAGE == '查无记录!' || !oData.GRID0) {121
                if (nCount == 1 || type != 'more') {
                    j_jgdlist.html(TZT.nodatadom);
                }
                fn && fn(); return;
            }
            var sDom = '';
            //oData.GRID0.shift();
            function toPrice(price, pointsize){
            	if(price == ''){
            		return '';
            	}
            	if(price.substr(0, 1) == '.'){
            		price = '0' + price;
            	}
            	return (+price).toFixed(pointsize);
            };  
            $.each(oData.GRID0, function (i, item) {
                var aItem = item.split('|');
                //合同序号
                var sContract = aItem[oData.CONTRACTNUMBER];
                //成交日期（交收日期或交割日期）
                var sJGDate = aItem[oData.CLOSINGDATE];
                //sJGDate = sJGDate.substr(0, 4) + '-' + sJGDate.substr(4, 2) + '-' + sJGDate.substr(6, 2);
                //股票名称
                var sStockName = aItem[oData.STOCKNAME];
                //股票代码
                var sStockCode = aItem[oData.STOCKCODE];
                //买卖标志
                var sBuyType = aItem[oData.TRANSTYPE];
                //成交价格
                var sCJPrice = toPrice(aItem[oData.TRANSPRICE], 3);
                //成交数量
                var sCJCount = aItem[oData.TRANSNUMBER];
                //成交金额
                var sCJMoney = toPrice(aItem[oData.TURNOVER], 2);
                //发生金额
                var sSFMoney = toPrice(aItem[oData.CLEARAMOUNT], 2);
                //标准手续费(净佣金)
                var sJYJ = toPrice(aItem[oData.STANDARDFEES], 2);
                //印花税
                var sYHS = toPrice(aItem[oData.STAMPTAX], 2);
                //交易规费
                var sJYGF = toPrice(aItem[oData.TRANSACTIONFEES], 2);
                //过户费
                var sGHF = toPrice(aItem[oData.TRANSFERFEES], 2);
                //资金本次余额
                var sQTF = toPrice(aItem[oData.OTHERFEES], 2);
                
                var arrindex = (nMaxCount + i);
                //oCache[(nMaxCount+i)] = sContract;
                var aCache = {
                    //数量
                    number: arrindex,
                    //合同序号
                    contract: sContract,
                    //交割日期
                    jsdate: sJGDate,
                    //证券代码
                    stockcode: sStockCode,
                    //证券名称
                    stockname: sStockName,
                    //买卖标志
                    buytype: sBuyType,
                    //成交价格
                    cjprice: sCJPrice,
                    //成交数量
                    cjcount: sCJCount,
                    //成交金额
                    cjmoney: sCJMoney,
                    //发生金额
                    fsmoney: sSFMoney,
                    //净佣金
                    jyj: sJYJ,
                    //印花税
                    yhs: sYHS,
                    //交易规费
                    jygf: sJYGF,
                    //过户费
                    ghf: sGHF,
                    //client_gender
                    qtf: sQTF
                };
                oCache.push(aCache);
                sDom += '<div class=" item borderbttom" data-jgd="' + arrindex + '">' +
                   ' <span class=" inlineBlock fields">' + sJGDate + '</span>' +
                    '<span class=" inlineBlock fields">' +
                         '<span class="stock name">' + sStockName + '</span>' +
                        ' <span class="stock code">' + sStockCode + '</span>' +
                    '</span>' +
                    '<span class=" inlineBlock fields">' + sBuyType + '</span>' +
                '</div>';
            });
            //oCache.maxcount = oData.MAXCOUNT;
            oTools.saveMapMesg({ 'jgddata': JSON.stringify(oCache) }, function () {
                if (type == 'more') {
                    j_jgdlist.children().last().removeClass('borderbttom');
                    j_jgdlist.append(sDom);
                } else {
                    j_jgdlist.html(sDom);
                }
                j_jgdlist.children().last().addClass('borderbttom');
                fn && fn();
                
            });
        });
    }
});