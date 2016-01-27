define(function (require,exports,module) {
    /*@前端公共类库精简版
     *@param $ - {function} - jquery 或者 zepto对象
     */
    function TZT($) {
        /*TOOLS中公用的请求
        *@param url {string} - 请求地址 
        *@param obj {object}或{string} - 发送的数据内容
        *@param fn  {function} - 回调函数
        */
        function _reqajax(url, obj, fn) {
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
        this.nodatadom = '<div class="nodatalist"> 啊偶，暂时没有数据哦亲~</div>';
        //常用数据交互方法
        this.TOOLS = {
            savexjtck: function (fn) {
                var day = new Date().getDate();
                var tzt = new TZT($);
                tzt.TOOLS.saveFileMesg({ xjtsy: day }, 'xjtsy', function () {
                    fn && fn();
                });
            },
            //是否显示现金通收益红点
            isshowxjtsy: function (fn) {
                var tzt =new  TZT($);
                tzt.TOOLS.getauthority( function (sRet) {
                    if (sRet == '0') { return; }
                    else {
                        var oSend = {
                            action: 46148,
                            func: 'searchKHXJTFHLS',
                            fundAccount: '($account)',
                            start: 0,
                            limit: 1
                        };
                        tzt.getData(tzt.REQ.XML, oSend, function (oData) {
                            var GRID1;
                            if (oData.GRID1) {
                                GRID1 = oData.GRID1;
                            }
                            else {
                                GRID1 = oData.BINDATA;
                            }
                            var isres = false;
                            if (!GRID1 || oData.ERRORNO == '-2') { fn && fn(isres); return; }
                            else {
                                var aItem;//GRID1[0].split('|');
                                if (oData.GRID1) {
                                    aItem = GRID1[0].split('|');
                                }
                                else {
                                    aItem = GRID1.split('|');
                                }
                                var day = +(aItem[1].substr(6, 2));
                                var now = new Date();
                                var today = now.getDate();
                                var yesterday = new Date(now.setDate(now.getDate() - 1)).getDate();
                                if (day == yesterday) {
                                    tzt.TOOLS.readFileMesg('xjtsy', function (oRead) {
                                        if (oRead && oRead.xjtsy == today) { $('.jy_icon02 em').remove();$('.j_xjthd').removeClass('i-have'); }
                                        else {
                                            $('<em class="radius"></em>').appendTo('.jy_icon02');$('.j_xjthd').addClass('i-have'); isres = true; tztsetrednot('31');
                                        }
                                    });
                                } else {
                                    $('.jy_icon02 em').remove();$('.j_xjthd').removeClass('i-have');
                                }
                            }
                            fn && fn(isres);
                        }, {BlockErr: true});
                    }
                });
            },
            config: {
                rxtappurl: ((/android/i).test(navigator.appVersion) ? 'com.thinkive.android.xiaodai_mobile' : "thinkiveOpenGuangDaFYD://"),
                rxtactivityurl: ((/android/i).test(navigator.appVersion) ? 'com.thinkive.android.xiaodai_mobile.activities.HomeActivity' : "https://appsto.re/cn/zCOM5.i"),
                rxtdownloadurl: ((/android/i).test(navigator.appVersion) ? "http://121.15.129.246/app/xrt-v1.0.apk" : "https://itunes.apple.com/us/app/xiao-rong-tong/id966428441?l=zh&ls=1&mt=8"),
            	tztupdatekhurl:'http://action:10073/?appurl=com.thinkive.mobile.account_zhongshan&&opentype=2&&activityurl=com.zhongshan.video.activitys.HomeActivity&&content=是否下载中山手机开户软件&&downloadurl=http://113.107.238.16/dd.myapp.com/16891/56AA49E88ADF90D2BFD2EA3336713F0F.apk?mkey=55daebb1fd81298c&f=d388&fsname=com.thinkive.mobile.account_zhongshan_1.0.1_1.apk&asr=02f1&p=.apk'
            },
            iscroll: function (select, fn) {
                function iScrollClick() {
                    if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return true;
                    if (/Chrome/i.test(navigator.userAgent)) return (/Android/i.test(navigator.userAgent));
                    if (/Silk/i.test(navigator.userAgent)) return false;
                    if (/Android/i.test(navigator.userAgent)) {
                        var s = navigator.userAgent.substr(navigator.userAgent.indexOf('Android') + 8, 3);
                        return parseFloat(s[0] + s[2]) < 44 ? false : true
                    }
                }
                var IScroll = require('iscroll');
                var options = {
                    //中间的元素是否可以点击
                    click: iScrollClick(),
                	zoom:true
                };
                var myScroll = new IScroll(select, options);
                var refreshmaxy = 20;
                //滚到底的最大值（负数）
                var bottomY;
                //当前位置
                var currentY
                var currentX;
                var flag = true;
                myScroll.on('scrollMove', function () {
                    bottomY = myScroll.maxScrollY;
                    currentY = myScroll.y;
                    currentX = myScroll.x;
                    if (fn) {
                        if (flag == true) {
                            if ($('.downrefresh').length < 1) {
                                $(select).children().children().first().before('<div class="downrefresh"></div>');
                            }
                            if (currentY >= 0 && currentY < refreshmaxy) {
                                $('.downrefresh').html('下拉刷新');
                                //console.log(bottomY + ',' + currentY);
                            }
                            else if (currentY > refreshmaxy) {
                                $('.downrefresh').html('释放刷新');
                            }
                            else {
                                $('.downrefresh').html('');
                            }
                            //如果拉到底部
                            if (currentY <= bottomY) {
                                if ($('.uprefresh').length < 1) {
                                    $(select).children().children().last().after('<div class="uprefresh">玩命加载中...</div>');
                                }
                            }
                        }
                    }
                });
                myScroll.on('onBeforeScrollStart', function () {
                    
                });
                document.addEventListener('touchend', function (e) {
                    if (fn) {
                        if (currentY > refreshmaxy) {
                            $('.downrefresh').html('玩命加载中...');
                            fn && fn('', function () { $('.downrefresh').html(''); myScroll.refresh(); });
                        }
                        else if (currentY < refreshmaxy) {
                            $('.downrefresh').html('');
                        }
                        //加载更多
                        if (currentY < bottomY) {
                            fn && fn('more', function () { $('.uprefresh').remove(); myScroll.refresh(); });
                        }
                    }
                }, false);
                $(select)[0].addEventListener('touchmove', function (e) {
                    var x = e.touches[0].clientX;
                    var y = e.touches[0].clientY;
                    var w_width =document.documentElement.clientWidth - 8;
                    var y_height = document.documentElement.clientHeight - 8;
                    if (x < 8 || x > w_width) {
                        flag = false;
                        $('.downrefresh').remove();
                        $('.uprefresh').remove();
                        myScroll.refresh();
                        flag = true;
                    }
                    if (y < 8 || y > y_height) {
                        flag = false;
                        $('.downrefresh').remove();
                        $('.uprefresh').remove();
                        myScroll.refresh();
                        flag = true;
                    }
                });
                return myScroll;
            },
            //获取现金通权限
            getauthority: function (fn) {
                var tzt = new TZT($);
            	
            	tzt.TOOLS.getLocalMesg(['fundaccount', 'khbranch', 'custcert', 'usercode'], function(oData) {
            		var oSend = {
            			action: 46151,
            			fundaccount: oData.FUNDACCOUNT,
            			khbranch: oData.KHBRANCH,
            			custcert: oData.CUSTCERT,
            			usercode: oData.USERCODE
            		};
            		tzt.getData(tzt.REQ.XML, oSend, function(oData) {
            			var sJSON = oData.XJT_RIGHTS;
            			fn && fn(sJSON); return;
            		})
            	});
            },
            //跳到现金通
            gotoxjt: function () {
                var tzt = new TZT($);
                var oTools = tzt.TOOLS;
                oTools.getLocalMesg(["user_token", "mobilecode"], function (oData) {
                    //生产
//                    changeURL('http://action:1964/?url=' + encodeURIComponent('https://zx.zszq.com/xjt-index?_device=mobile'));
                    //测试
                    changeURL('http://action:1964/?url=' + encodeURIComponent('http://csxjt.zszq.com.cn:8080/xjt-index?_device=mobile'));
                });
            },
            //设置某个元素的告诉，屏幕高度减去 height参数
            setHeight: function (jdom, height) {
                var screenHeight = document.documentElement.clientHeight;
                var reduce = screenHeight - height;
                jdom.css('height',reduce+'px');
            },
            isLogin: function (fn,fn2) {
                new TZT($).TOOLS.getLocalMesg(['jyloginflag'], function (oData) {
                    var logintype = oData.JYLOGINFLAG;
                    //未登录
                    if (logintype == '0' || logintype == '1') {
                        fn2 && fn2();
                    } else if (logintype == '2') {
                        fn && fn();
                    }
                });
            },
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
                var
                  sMesgType = $.type(saveMesg),
                  sFileType = $.type(fileName),
                  TYPE = '', SAVEDATA = '';
                if (sMesgType === "object") { //C类型
                    TYPE = 'C';
                } else if (sMesgType === "string") {
                    if (sFileType === "function") {
                        return false;//两种情况：传了参数1,3，或者参数2,3 都是非法参数
                    } else if (sFileType == "string") {
                        TYPE = 'D';
                    } else {
                        return false;//非法格式	
                    }
                } else if (sMesgType == "array") {
                    var aThisType = $.type(saveMesg[0]);
                    if (aThisType === "object") {
                        TYPE = 'A';
                    } else {
                        TYPE = 'B';
                    }
                }
                if (TYPE && TYPE == 'A') {
                    for (var x = 0 ; x < saveMesg.length ; x++) {
                        for (var p in saveMesg[x]) {
                            SAVEDATA += p + "|" + saveMesg[x][p] + "|";
                        }
                        SAVEDATA = SAVEDATA.slice(0, -1);
                        SAVEDATA += ",";
                    }
                } else if (TYPE && TYPE == 'B') {
                    SAVEDATA = saveMesg.toString();
                } else if (TYPE && TYPE == 'C') {
                    for (var x in saveMesg) {
                        SAVEDATA += x + '=' + saveMesg[x] + '&';
                    }
                } else if (TYPE && TYPE == 'D') {
                    SAVEDATA = saveMesg;
                } else {
                    return false;
                }
                if (TYPE == 'A' || TYPE == 'C') { SAVEDATA = SAVEDATA.slice(0, -1); }
                SAVEDATA = TYPE + '$$' + SAVEDATA;
                //console.log(SAVEDATA);
                var sSendURL = "/reqsavefile?filename=" + fileName;
                $.ajax({
                    url: sSendURL,
                    type: "POST",
                    data: encodeURI(SAVEDATA),
                    success: function (oData) {
                        fnSuccess && fnSuccess(oData);
                    }
                })
            },
            /*
            *@读取本地缓存文件信息
             *@param:fileName  string  读取文件的文件名
             *@param:fnSuccess {function} 读取成功的回调函数
            */
            readFileMesg: function (fileName, fnSuccess) {
                var sSendURL = "/reqreadfile?filename=" + fileName;
                $.ajax({
                    url: sSendURL,
                    success: function (oData) {
                        if (!oData) {
                            fnSuccess(false);
                        } else {
                            splits(oData);
                        }
                    }
                })
                var MESG, TYPE, READDATA, SPLITDATA;
                function splits(oData) {
                    MESG = decodeURI(oData).split('$$'); TYPE = MESG[0]; READDATA = MESG[1];
                    if (TYPE == 'A') {
                        SPLITDATA = [];
                        var aThisSplit = READDATA.split(',');
                        for (var x = 0; x < aThisSplit.length ; x++) {
                            var oThis = {}, aSecod = aThisSplit[x].split('|');
                            for (var p = 0 ; p < aSecod.length ; p++) {
                                if (p % 2 == 0) {
                                    oThis[aSecod[p]] = aSecod[p + 1];
                                    p++;
                                }
                            }
                            SPLITDATA.push(oThis);
                        }
                    } else if (TYPE == 'B') {
                        SPLITDATA = READDATA.split(',');
                    } else if (TYPE == 'C') {
                        SPLITDATA = {};
                        var aThisSplit = READDATA.split('&');
                        for (var x = 0 ; x < aThisSplit.length ; x++) {
                            var aThis = aThisSplit[x].split('=');
                            SPLITDATA[aThis[0]] = aThis[1];
                        }
                    } else if (TYPE == 'D') {
                        SPLITDATA = READDATA;
                    }
                    fnSuccess && fnSuccess(SPLITDATA);
                }
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
        this.TAG = new Date().getTime();
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
            ISANDROID: (/android/i).test(navigator.appVersion.toLocaleLowerCase()),
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
//        this.getData = function (sRequestURL, oSendData, fnSuccess, oConfig) {
//            var oDefConfig = {
//                type: "POST",
//                url: sRequestURL,
//                data: oSendData,
//                contentType: "application/x-www-form-urlencoded;", //避免乱码
//                success: function (oData) {
//                    var nErrorNO = (+oData.ERRORNO), sErrorMessage = oData.ERRORMESSAGE;
//                    //判断是否登录
//                    if (nErrorNO == -204009 || nErrorNO == -204001 || nErrorNO == -204007 || nErrorNO == -207001 && oData.ACTION!='112') {
//                        changeURL("http://action:10402/?context=&&url=" + encodeURIComponent("http://action:10090/?loginType=1&&loginKind=0&&url=")); return;
//                    }

//                    if (nErrorNO < 0) {
//                        //屏蔽任何错误
//                        if (oConfig && oConfig.BlockErr === true) {
//                            fnSuccess && fnSuccess(oData); return;
//                        }
//                        alert(sErrorMessage);
//                        oConfig && oConfig.ZeroLeft && oConfig.ZeroLeft(oData);
//                    } else {
//                        fnSuccess && fnSuccess(oData);
//                    }
//                },
//                error: function (oErr) {
//                    switch (oErr) {
//                        case 'timeout':
//                            alert("请求超时");
//                            break;
//                        case 'dataerr':
//                            alert("数据格式出错");
//                            break;
//                        default:
//                            break;
//                    }
//                    return false;
//                }
//            }, oAjaxParm = {}, oParam = oConfig || {};
//            oAjaxParm = $.extend(oParam, oDefConfig);
//            $.ajax(oParam);
//        }
    	this.getData = function (sRequestURL, oSendData, fnSuccess, oConfig) {
            var app = window.navigator.appVersion.toLocaleLowerCase();
            var newUrl = '',newData = '';
            if(sRequestURL.indexOf("reqsavefile")>=0 || sRequestURL.indexOf("reqreadfile")>=0){
	            newUrl = sRequestURL;
            }else{
	            if(sRequestURL.indexOf('?')>=0){
                    var dataSurl = sRequestURL.split('?');
                    newUrl = dataSurl[0];
                    newData = dataSurl[1];
                }else{
                    newUrl = sRequestURL;
                }
            }
            if(oSendData != ''){
                for(var x in oSendData){
    	            // if(""){}
    	            if(newData == ""){
    		            newData += x+'='+encodeURIComponent(oSendData[x]);
    	            }else{
    		            newData+='&'+x+'='+encodeURIComponent(oSendData[x]);	
    	            }
                }
            }

            if(app.indexOf("android")>0){
                try{
                    newData = window.MyWebView.onWebdataEncrypt(newData);
                }catch(e){
                    //questUrl = sOldurl;
                }
            }
        	var oDefConfig = {
                type: "POST",
		        url: newUrl,
		        data: newData,
                contentType: "application/x-www-form-urlencoded;", //避免乱码
                success: function (oData) {
                    var nErrorNO = (+oData.ERRORNO), sErrorMessage = oData.ERRORMESSAGE;
                    //判断是否登录
                    if (nErrorNO == -204009 || nErrorNO == -204001 || nErrorNO == -204007 || nErrorNO == -207001 && oData.ACTION!='112') {
                        changeURL("http://action:10402/?context=&&url=" + encodeURIComponent("http://action:10090/?loginType=1&&loginKind=1&&url=")); return;
                    }

                    if (nErrorNO < 0) {
                        //屏蔽任何错误
                        if (oConfig && oConfig.BlockErr === true) {
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
        //弹出层组件
        this.dialog = {
            open: function (jdom) {
                if ($('.j_tztdialog').length == 0) {
                    var tag = +new Date();
                    var cls = 'j_' + tag+'tztdialog'
                    var sAlert = '<div class="masklast hidden j_tztdialog ' + cls + '">' +
        '<div class="mask"></div><div class="alertcontent j_tztdialogcontent"></div></div>';
                    $('body').append(sAlert);
                }
                if (jdom.parent() !== $('.j_tztdialogcontent')) {
                    $('.j_tztdialogcontent').html('');
                    $('.j_tztdialogcontent').append(jdom);
                    jdom.show();
                }
                var _width = jdom.outerWidth();
                var _height = jdom.outerWidth();
                $('.j_tztdialogcontent').css('width', _width + 'px');
                $('.j_tztdialogcontent').css('height', _height + 'px');
                $('.j_tztdialog').fadeIn(100);
                return tag;
            },
            close: function (id) {
                var cls = '.j_' + id + 'tztdialog';
                var content = $('.j_tztdialogcontent').children();
                if (content.length !== 0) {
                    content.hide();
                    content.appendTo('body');
                }
                if (id) {
                    $(cls).remove();
                } else {
                    $('.j_tztdialog').remove();
                }
            }
        };
        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
        // 例子： 
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
        Date.prototype.Format = function (fmt) { //author: meizz 
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
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
        window.action10061 = function (url,param) {
            changeURL('http://action:10061/?secondtype=9' + param + '&&fullscreen=1&&firsttype=10&&url=' + encodeURIComponent(url));
        }
        window.actionfunc10061 = function (url, func) {
            changeURL('http://action:10061/?secondtype=99&&secondtext='+encodeURIComponent('清除')+'&&fullscreen=1&&firsttype=10&&url=' + encodeURIComponent(url) + '&&secondjsfuncname=' + func);
        }
        //判断是否登录，登录之后执行js或者10061跳转页面
        window.gochangeURL = function (url,fuc) {
            if (fuc) {
                changeURL('http://action:10090/?loginkind=1&&jsfuncname=' + fuc);
            } else {
                changeURL('http://action:10090/?loginkind=1&&url=' + encodeURIComponent('http://action:10061/?secondtype=9&&fullscreen=1&&firsttype=10&&url=' + encodeURIComponent(url)));
            }
        }
        ////买入
        //window.action12310 = function (url) {
        //    changeURL("http://action:10090/?url=" + encodeURIComponent("http://action:10061/?type=0&&fullscreen=1&&secondtype=9&&url=" + encodeURIComponent('http://action:12310/?')));
        //}
        //买入
        window.action12310 = function (url) {
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:12310/?'));
        }
        //卖出
        window.action12311 = function (url) {
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:12311/?'));
        }
        //持仓
        window.action12342 = function (url) {
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:12342/?'));
        }
        //撤单
        window.action12340 = function (url) {
            changeURL("http://action:10090/?url="+ encodeURIComponent('http://action:12340/?'));
        }
        //银证转账
        window.action12330 = function (url) {
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:12330/?'));
        }
        //查询
        window.action12303 = function (url) {
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:12303/?'));
        }
        //融资融券
        window.action15001 = function () {
            changeURL('http://action:15001/?');
        }
        //历史委托
        window.action12385 = function () {
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:10061/?secondtype=9&&fullscreen=1&&firsttype=10&&url=' + encodeURIComponent('http://action:12385/?')));
        }
        //历史成交
        window.action12383 = function () {
            //changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:12383/?'));
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:10061/?secondtype=9&&fullscreen=1&&firsttype=10&&url=' + encodeURIComponent('http://action:12383/?')));
        }
        //交割单
        window.action12380 = function () {
            changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:10061/?secondtype=9&&fullscreen=1&&firsttype=10&&url=' + encodeURIComponent('http://action:12380/?')));
            //changeURL("http://action:10090/?url=" + encodeURIComponent('http://action:12380/?'));
        }
        window.action10090 = function (url) {
            changeURL('http://action:10090/?logintype=1');
        }
        //外呼app
        window.action10073 = function (url1,url2,url3) {
            changeURL('http://action:10073/?opentype=2&&appurl=' +encodeURIComponent( url1) + '&&activityurl='+encodeURIComponent( url2)+'&&content='+encodeURIComponent('是否下载小融通?')+'&&downloadurl=' + encodeURIComponent( url3));
        }
        //进入现金通页面
        window.gotoxjt = function () {
            gochangeURL('/zsjy/app/wd/wd-byw/byw-xjt/byw-xjt.html');
        }
        //增加或删除tab4的红点
        window.action1901tab4 = function (str) {
            changeURL('http://action:1901/?tab4=' + str);
        }
        //增加或删除tab5的红点
        window.action1901tab5 = function (str) {
            changeURL('http://action:1901/?tab5=' + str);
        }
        window.openacc = function () {
            changeURL('http://action:10061/?fullscreen=1&&secondtype=9&&firsttype=99&&firsttext=退出&&firsturl='+encodeURIComponent('http://action:3413/')+'&&url='+ encodeURIComponent('/zsjy/app/open/open.html'));
        }
        String.prototype.replaceAll = function (AFindText, ARepText) {
            raRegExp = new RegExp(AFindText, "g");
            return this.replace(raRegExp, ARepText);
        }
        this.wordCount = function (sContent, bIstrim) {
            sContent = (sContent || "")
				.replace(/<br[^>]*?>/g, "**")	// 将换行符替换成一个双字节字符。
				.replace(/<[^>]*?>/g, "")	// 过滤 HTML标签。
				.replace(/[\r\n	]*/g, "")	// 过去换行和 tab 符。
				.replace(/\&nbsp;/g, " ")	// 空格转换。
				.replace(/[^\x00-\xff]/g, "**")	// 转换成双字节统计。
				.replace(/\s/g, "")          //过滤空格
				.replace(/[\r\n]/g, "")         //过滤回车
            ;

            if (bIstrim) {
                sContent = $.trim(sContent);
            }
            // 使用双字节统计，并且小数向上取整。
            return sContent.length / 2 + 0.5 >> 0;
        }
        //设置红点
        window.tztsetrednot = function (type) {
            //现金通
            if (type == '31') {
                action1901tab4('1');
                $('.j_xjthd').addClass('i-have');
            }
            //新股申购的
            else if (type == '32') {
                action1901tab4('1');
                $('.j_redico').addClass('new-info');
            }
            //消息中心的
            else {
//                action1901tab5('1');
                $('.j_mesgred').addClass('new-info');
            }
        }
        window.action1964 = function (url) {
            changeURL('http://action:1964/?url='+encodeURIComponent(url));
        }
        window.action3413 = function () {
            changeURL('http://action:3413/?');
        }
        window.action10002 = function () {
            changeURL('http://action:10002/?');
        }
        //充值现金通
        window.actioncz = function () {
            var transferUrl = "http://action:10090/?url=" + encodeURIComponent('http://action:12302/?url=' + encodeURIComponent('https://zx.zszq.com/xjt-transfer-sucess?_device=mobile'));
            action1964(transferUrl);
            //changeURL(transferUrl);
            //var id = setTimeout(function () {
            //    action3413(); clearTimeout(id);
            //},1000);
        }
    }
    module.exports = TZT;
});
