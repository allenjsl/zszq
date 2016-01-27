/// <reference path="../../../lib/jquery/jquery.js" />
/// <reference path="../../../lib/common/common.js" />
define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    $(function () {
        init();
    });
    function init() {
        pageEvent();
    }
    function pageEvent() {
        //办业务
        $('.j_jbxm').on('click', function () {
            action10061('/zsjy/app/wd/wd-zjb/zjb-jbmx/zjb-jbmx.html');
        });
        //办业务
        $('.j_cdp').on('click', function () {
            action10061('/zsjy/app/wd/wd-zjb/zjb-cdp/zjb-cdp.html');
        });
    }
});