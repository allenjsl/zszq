/// <reference path="../../../../lib/jquery/jquery.js" />
/// <reference path="../../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    $(function () {
        init();
    });
    function init() {
        pageEvent();
    }
    function pageEvent() {
        //跳到现金通
        oTools.gotoxjt();
    }
});