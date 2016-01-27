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
        //切换要修改密码的选项
        $('.j_pwdtype').on('click', function () {
            $('.j_pwdtype').find('.desc').removeClass('select');
            $(this).find('.desc').addClass('select');
        });
        //确认修改按钮
        $('.j_submit').on('click', function () {
            var pwdtype = $('.select').attr('data-type');
            var pwd = $('.j_pwd').val();
            var newpwd = $('.j_newpwd').val();
            var newpwdaggin = $('.j_newpwdangin').val();
            if (!pwd) { alert('原密码不能为空!'); return; }
            if (!newpwd) { alert('新密码不能为空!'); return; }
            if (!newpwdaggin) { alert('确认新密码不能为空!'); return; }
            if (newpwd != newpwdaggin) {
                alert('两次输入新密码不一致!'); return;
            }
            var obj = {
                PASSWORDTYPE: pwdtype,
                PassWord: pwd,
                NewPassword: newpwd
            };
            action112(obj, function () {
                alert('修改密码成功！');
            });
        });
    }
    //修改密码
    function action112(obj,fu) {
        var oSend = {
            action: 112,
            MobileCode: '($MobileCode)',
            Token: '($Token)',
            Reqno: +new Date(),
            ReqlinkType: 1,
            //密码类型'1'：资金密码  '2'：交易密码  '0'：通讯密码
            PASSWORDTYPE: obj.PASSWORDTYPE,
            //老密码
            PassWord: obj.PassWord,
            //新密码
            NewPassword: obj.NewPassword
        };
        TZT.getData(TZT.REQ.XML, oSend, function (oData) {
            fu && fu();
        });
    }
});