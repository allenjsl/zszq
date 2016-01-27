/// <reference path="../lib/zepto/zepto.js" />
/// <reference path="../lib/seajs/sea.js" />
//seajs.use(["zepto"], function ($) {
//    $("#input").val("123");
//});
define(function (require, exports, module) {
    var IScroll = require('iscroll');
    var $ = require('zepto');
    $("#click").on("click", function () {
        $('#wapper').hide(300);
    });
    $("#click2").on("click", function () {
        $('#wapper').show(300);
    });
    $("#click3").on("click", function () {
        $('#wapper').hide();
    });
    $("#click4").on("click", function () {
         $('#wapper').show();
    });
    /*var options = {
        //自动分割容器，用于制作走马灯效果等。
        snap: true,
        //滚动动量减速
        //deceleration: 0.0006,
        //是否渐隐滚动条
        fadeScrollbars: false,
        //是否显示默认滚动条
        scrollbars: true,
        //是否开启弹力动画效果
        bounce: true,
        //中间的元素是否可以点击
        click: true
    };
    var myScroll = new IScroll('#wapper', options);
    $.TOOLS.saveMapMesg({name:'simon',age:'12'}, function (oData) {
        console.log(oData);
        $.TOOLS.readMapMesg(['name','age'], function (oRet) {
            console.log(oRet);
        });
    });
    var oSaveFile = { savefine: 'save', arr: [1, 2, 3] };
    $.TOOLS.saveFileMesg(oSaveFile, 'file_lbx1', function (o) {
        console.log(o);
        $.TOOLS.readFileMesg('file_lbx1', function (oRet) {
            console.log(oRet);
        });
    });
    $.TOOLS.setLocalMesg({tztx:"123",tzty:"456"}, function (oData) {
        $.TOOLS.getLocalMesg(['tztx', 'tzty'], function (oRet) {
            console.log(oRet);
        });
    });
    var sUrl = $.getUrlParameter("age");
    var sUrl2 = $.getUrlParameter("name");
    var sUrl3 = $.getUrlParameter('dd');
    console.log(sUrl+','+sUrl2+','+sUrl3);*/
});