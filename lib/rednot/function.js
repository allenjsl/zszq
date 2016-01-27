define(function (require, exports, module) {
    var $ = require('$');
    var TZT = new (require('tzt'))($);
    var oTools = TZT.TOOLS;
    var o = {
        isread: isread,
        removenot: removenot,
        mesreadnot:mesreadnot
    };
    //是否有新股,有进入回调
    function isread(fn) {
        var oSend = {
            action: 46106,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            nPage: 10,
            maxcount: 10
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            if (oData.GRID3) {
                TZT.TOOLS.readFileMesg('tzt_xgsg', function (oData) {
                    var nowday = new Date().getDate();
                    if (oData.xgsg != nowday) {
                        fn && fn(true); return;
                    }
                    fn && fn(false);
                });
            } else {
            	fn && fn(false);            	
            }
        });
    }
    //点击后去除红点
    function removenot(fn) {
        TZT.TOOLS.saveFileMesg({ xgsg: new Date().getDate() }, 'tzt_xgsg', function (oData) {
            fn && fn();
        });
    }
    function mesreadnot(fn) {
        oTools.getLocalMesg(['tztbadgenumber'], function (oData) {
            if (+oData.TZTBADGENUMBER > 0) {
                //10071
                /*changeURL('http://action:1901/?tab5=' + 1);*/ fn && fn(true); return;
            }
            fn && fn(false);
        })
    }
    module.exports = o;
});