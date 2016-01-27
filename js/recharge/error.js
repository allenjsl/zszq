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
        $('.j_goindex').on('click', function () {
            action10002();
        });
        $('.j_chals').on('click', function () {
            actioncz();
        });
    }
});