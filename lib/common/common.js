/*@前端公共类库精简版
 *@param $ - {function} - jquery 或者 zepto对象
 */
function fnTZT($) {
    /*TOOLS中公用的请求
    *@param url {string} - 请求地址 
    *@param obj {object}或{string} - 发送的数据内容
    *@param fn  {function} - 回调函数
    */
    function _reqajax(url,obj,fn) {
        $.ajax({
            type: "post",
            url: url,
            data: obj,
            dataType: "json",
            success: function (oData) {
                fn && fn(oData);
            }
        });
    }
    //常用数据交互方法
    this.TOOLS = {
        /*@保存信息到本地客户端内存
		 *@param obj {object} - 要保存的对象型数据 - 必要性 - Y
		 *@param fnSuccess {function} - 成功保存的回调函数 ，可接收一个Boolean类型参数 - 必要性 - N
		 *@return void
		*/
        saveMapMesg: function (obj, fnSuccess) {
            _reqajax("/reqsavemap?", obj, fnSuccess);
        },
        /*@读取本地客户端内存
		 *@param sArray {Array} - 要读取的信息群 - 必要性 - Y 
		 *@param fnSuccess {function} - 成功读取的回调函数 ，并把读取的对象型信息作为参数传入该函数 - 必要性 - N
		 *@return void
		*/
        readMapMesg: function (sArray, fnSuccess) {
            var obj = {};
            for (var x in sArray) {
                obj[sArray[x]] = '';
            }
            _reqajax("/reqreadmap?", obj, fnSuccess);
        },
        /*
         *@保存信息到本地文件
         *@param saveMesg {string}或{object} 保存数据内容
         *@param:fileName  string  保存数据的模块名称 字符串类型
         *@param:fnSuccess {function} 保存成功的回调函数
        */
        saveFileMesg: function (saveMesg, fileName, fnSuccess) {
            var sJSON = '';
            if (typeof (saveMesg) == 'object') {
                sJSON = JSON.stringify(saveMesg);
            }
            _reqajax(("/reqsavefile?filename=" + fileName), (sJSON || saveMesg), fnSuccess);
        },
        /*
		*@读取本地缓存文件信息
		 *@param:fileName  string  读取文件的文件名
		 *@param:fnSuccess {function} 读取成功的回调函数
		*/
        readFileMesg: function (fileName, fnSuccess) {
            _reqajax(("/reqreadfile?filename=" + fileName), null, fnSuccess);
        },
        /*@读取本地客户端信息
       *@param sArray {Array} - 要读取的信息群 - 必要性 - Y 
       *@param fnSuccess {function} - 成功读取的回调函数 ，并把读取的对象型信息作为参数传入该函数 - 必要性 - N
       *@return void
      */
        getLocalMesg: function (sArray, fnSuccess) {
            var obj = {};
            for (var x in sArray) {
                obj[sArray[x]] = '';
            }
            _reqajax("/reqlocal?", obj, fnSuccess);
        },
        /*@保存信息到本地客户端
        *@param obj {object} - 要保存的对象型数据 - 必要性 - Y
        *@param fnSuccess {function} - 成功保存的回调函数 ，可接收一个Boolean类型参数 - 必要性 - N
        *@return void
       */
        setLocalMesg: function (obj, fnSuccess) {
            _reqajax("/reqsofttodo?", obj, fnSuccess);
        }
    }
    //常用请求类型
    this.REQ = {
        //请求服务器数据
        XML: "/reqxml?",
        //请求客户端数据
        //BINARY: "/reqbinary?",
        //请求签名数据
        SIGNATURE: "/reqsignature?"
        //本地播放指定URL视频
        //TZTVEDIO: "/tztvideo?",
        //请求本地保存数据
        //SAVEMAP: '/reqsavemap?',
        //读取本地保存数据
        //READMAP: '/reqreadmap?',
        //请求本地保存文件
        //SAVEFILE: '/reqsavefile?',
        //读取本地保存文件
        //READFILE: '/reqreadfile?'
    }
    //常用正则
    this.REG = {
        //中文
        "CHINESE": /^[\u4e00-\u9fa5]+$/i,
        //中文姓名
        "NAME": /^[\u4e00-\u9fa5]{2,8}$/i,
        //手机号码验证
        "PHONE": /^1(33|42|44|46|48|49|53|80|81|89|30|31|32|41|43|45|55|56|85|86|34|35|36|37|38|39|40|47|50|51|52|57|58|59|82|83|84|87|88|77|76|84|78|70)[0-9]{8}$/,
        //六位数字验证
        "SIXNUM": /^\d{6}$/,
        //邮箱地址
        "EMAIL": /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
        //日期验证，格式为 20140221 ,2014/02/21,2014-02-21,2014.02.21
        "DATE": /^(?:(?:1[0-9]|[0-9]{2})[0-9]{2}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:(?:1[6-9]|[2-9][0-9])(?:0[48]|[2468][048]|[13579][26])|(?:16|[2468][048]|[3579][26])00)([-/.]?)0?2\2(?:29))$/
    }
    //获取时间戳
    this.TAG = function () { return new Date().getTime() };
    //常用客户端功能号
    this.GOWHERE = {
        //关闭当前页面，打开新页面
        G1964: "http://action:1964/?",
        //关闭当前页面(关闭当前的webview)
        G3413: "http://action:3413/?",
        //证书申请并安装
        G10052: "http://action:10052/?",
        //证书校验
        G10053: "http://action:10053/?",
        //打开指定URL并定制右上角操作
        G10061: "http://action:10061/?",
        //调用客户端登陆界面
        G10090: "http://action:10090/?",
        //关闭当前页面，返回前一页面(没有页面可返回则关闭webview)
        G10002: "http://action:10002/?"
    }
    //设备信息
    this.DEVICE = {
        //app信息
        APP: navigator.appVersion,
        //是否是安卓
        ISANDROID: (/android/i).test(navigator.appVersion),
        //ISPLAYBOOK: (/playbook/i).test(navigator.appVersion),
        //ISTOUCHPAD: (/hp-tablet/i).test(navigator.appVersion)，
        //是否是ios
        ISIOS: (/iphone|ipad/i).test(navigator.appVersion)
        
    };
    /*
			 *@notice 获取url中的参数
			 *@param sParamName {string } 要获取的参数字段名 必传参数
			 *@param sURL { string }  获取字段值的源地址 可不传，默认为 window.location.search
			 */
    this.getUrlParameter = function (sParamName, sURL) {
        var sURL = decodeURIComponent(sURL || location.search.slice(1));
        var rexUrl = new RegExp("(^|&)" + sParamName + "=([^&]*)(&|$)", "i");
        var aRes = sURL.match(rexUrl);
        return (aRes && aRes[2]) || "";
    }
    /*
			 *@notice 通用Ajax请求
			 *@params sRequestURL { string } 发起请求的地址
			 *@params oSendData { Object } 请求的参数
			 *@params fnSuccess { function  } 请求成功后的回调函数
			 *@params oConfig { Object } Ajax 的配置项
			 */
    this.getData = function (sRequestURL, oSendData, fnSuccess, oConfig) {
        var oDefConfig = {
            type: "POST",
            url: sRequestURL,
            data: oSendData,
            contentType: "application/x-www-form-urlencoded;", //避免乱码
            success: function (oData) {
                var nErrorNO = (+oData.ERRORNO), sErrorMessage = oData.ERRORMESSAGE;
                if (nErrorNO < 0) {
                    //屏蔽任何错误
                    if (oConfig && oConfig.BlockErr===true) {
                        fnSuccess && fnSuccess(oData); return;
                    }
                    alert(sErrorMessage);
                    oConfig && oConfig.ZeroLeft && oConfig.ZeroLeft(oData);
                } else {
                    fnSuccess && fnSuccess(oData);
                }
            },
            error: function (oErr) {
                switch (oErr) {
                    case 'timeout':
                        alert("请求超时");
                        break;
                    case 'dataerr':
                        alert("数据格式出错");
                        break;
                    default:
                        break;
                }
                return false;
            }
        }, oAjaxParm = {}, oParam = oConfig || {};
        oAjaxParm = $.extend(oParam, oDefConfig);
        $.ajax(oParam);
    }
    /**
 * tppl.js 极致性能的 JS 模板引擎
 * Github：https://github.com/yangjiePro/tppl
 * 作者：杨捷  
 * 邮箱：yangjie@jojoin.com
 *
 * @param tpl {String}    模板字符串
 * @param data {Object}   模板数据（不传或为null时返回渲染方法）
 * @param fast {Boolen}   是否为快速模式
 *
 * @return  {String}    渲染结果
 * @return  {Function}  渲染方法
 *
 */
    this.tppl = function (tpl, data, fast) {
        var fn = function (d, f) {
            if (f || fast) {
                fn.$$ = fn.$$ || new Function(fn.$);
                return fn.$$.apply(d);
            } else {
                var i, k = [], v = [];
                for (i in d) {
                    k.push(i);
                    v.push(d[i]);
                };
                return (new Function(k, fn.$)).apply(d, v);
            }
        };
        if (!fn.$) {
            fn.$ = 'var $="";';
            var tpls = tpl.replace(/[\r\t\n]/g, " ").replace(/\'/g, "\\'").split('[:')
              , i = 0
            while (i < tpls.length) {
                var p = tpls[i];
                if (i) {
                    var x = p.indexOf(':]');
                    fn.$ += p.substr(0, x);
                    p = p.substr(x + 2)
                }
                fn.$ += "$+='" + p.replace(/\[\=\:(.*?)\:\]/g, "'+$1+'") + "';";
                i++;
            }
            fn.$ += "return $";
        }

        return data ? fn(data) : fn;
    }
    //手机页面跳转
    window.changeURL = function (str) {
        var app = window.navigator.appVersion.toLocaleLowerCase();
        if (app.indexOf("windows phone") > 0) {
            window.external.notify(str);
        } else if (app.indexOf("iphone") > 0) {
            window.location.href = str;
        } else if (app.indexOf("android") > 0) {
            window.MyWebView.onJsOverrideUrlLoading(str);
        } else {
            window.location.href = str;
        }
    }
}
var TZT = new fnTZT($);