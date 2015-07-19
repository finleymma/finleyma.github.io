/*****************************************************************************************/

/**
 * @fileoverview 测速时间点统计器
 *
 */


/**
 *
 *
 * @ignore
 *
 *
 */
if(typeof(window.TCISD) == "undefined"){
	window.TCISD = {};
}


/**
 * 创建一个时间点统计对象实体
	若是已经创建过相同名称的对象则返回已有对象
 *
 * @param {string} [statName = flagArr.join("_")] 时间点统计器的名称
 * @param {object} [flagArr = [175, 115, 1]] 各个统计参数标识
 * @param {object} [standardData = null] 时间点统计基准数据
 {
	 timeStamps:{
		 1: 123, //第一时间点标准时延123ms
		 2: 350  //..二..............350ms
	 }
 }

 * @return {object} TCISD.TimeStat instance
 *
 *
 */
TCISD.createTimeStat = function(statName, flagArr, standardData){
	var _s = TCISD.TimeStat,
		t,
		instance;

	flagArr = flagArr || _s.config.defaultFlagArray; //这里都是内部人用，就不严谨检查了
	t = flagArr.join("_");
	statName = statName || t; //这里都是内部人用，就不严谨检查了

	if(instance = _s._instances[statName]){
		return instance;
	} else {
		return (new _s(statName, t, standardData));
	}
};

/**
 * 给当前时间点统计器打下一个新的时间点记录
	默认增加在序列尾部的位置
 *
 * @method
 * @param {number} [timeStampSeq = instance.timeStamps.length] 时间点的位置
 * @param {string} [statName = flagArr.join("_")] 时间点统计器的名称
 * @param {object} [flagArr = [175, 115, 1]] 各个统计参数标识
 * @return {object} TCISD.TimeStat instance
 *
 *
 */
TCISD.markTime = function(timeStampSeq, statName, flagArr){
	var ins = TCISD.createTimeStat(statName, flagArr);
	ins.mark(timeStampSeq);

	return ins;
};

/**
 * 时间点统计器类定义
 *
 * @class TCISD.TimeStat
 *
 *
 *
 */
TCISD.TimeStat = function(statName, flags, standardData){
	var _s = TCISD.TimeStat;
	this.sName = statName;
	this.flagStr = flags;
	this.timeStamps = [null];
	this.zero = _s.config.zero;
	if(standardData){
		this.standard = standardData;
	}
	_s._instances[statName] = this;
	_s._count++;
};

/**
 * 获取一个指定时间点的详细数据，若设置过基准值的话，能得到延迟率指数，可用来参考评价客户端性能
 *
 * @method
 * @param {number} seq 时间点的位置
 * @return {object} {
	                    zero: //Date对象表达的改时间点统计器的零时点
						time: //Date对象表达的概时间点统计点的时刻
						duration: //时延（time - zero）
						delayRate: //延迟率：若配置过该时间点的标准延迟，则这里给出延迟率：
								算法：（单位均为ms, 延迟率为负数即标识较快）
									延迟率 = (实际延迟 - 标准延迟) / 标准延迟
                    }
 *
 *
 */
TCISD.TimeStat.prototype.getData = function(seq){
	var r = {}, t, d;
	if(seq && (t = this.timeStamps[seq])){
		d = new Date();
		d.setTime(this.zero.getTime());
		r.zero = d;
		d = new Date();
		d.setTime(t.getTime());
		r.time = d;
		r.duration = t - this.zero;

		if(this.standard && (d = this.standard.timeStamps[seq])){
			r.delayRate = (r.duration - d) / d;
		}
	}else{
		r.timeStamps = TCISD.TimeStat._cloneData(this.timeStamps);
	}

	return r;
};

/**
 * 防止重要数据抛出后被修改
 *
 * @private
 *
 *
 */
TCISD.TimeStat._cloneData = function(obj) {
	if ((typeof obj) == 'object') {
		var res = (QZFL.lang.isArray(obj)) ? [] : {};
		for (var i in obj) {
			res[i] = QZFL.lang.objectClone(obj[i]);
		}
		return res;
	} else if ((typeof obj) == 'function') {
		return Object;
	}
	return obj;
};


/**
 * 给当前时间点统计器打下一个新的时间点记录
	默认增加在序列尾部的位置
 *
 * @method
 * @param {number} [seq = instance.timeStamps.length] 时间点的位置
 * @return {object} TCISD.TimeStat instance
 *
 *
 */
TCISD.TimeStat.prototype.mark = function(seq){
	seq = seq || this.timeStamps.length;
	this.timeStamps[Math.min(Math.abs(seq), 99)] = new Date();
	return this;
};

/**
 * 将另一个时间点统计对象实体合并进来
		例如：A.merge(B); 则将B的时间点序列排在A的时间点序列之前，A的原时间点ID将拍后，位置偏移发生改变，若B有配置过时延对比标准，则标准也将merge到A的标准中，且标准ID维持不变，这里注意一下会发生的对应错误问题

		此功能主要面向Qzone这样的复杂前端场景，iframe中页面对外层时间点统计结果存在“继承”的关系
 *
 * @method
 * @param {object} baseTimeStat TCISD.TimeStat instance
 * @return {object} TCISD.TimeStat instance
 *
 *
 */
TCISD.TimeStat.prototype.merge = function(baseTimeStat){
	var x, y;
	if(baseTimeStat && (typeof(baseTimeStat.timeStamps) == "object") && baseTimeStat.timeStamps.length){
		this.timeStamps = baseTimeStat.timeStamps.concat(this.timeStamps.slice(1));
	}else{
		return this;
	}

	if(baseTimeStat.standard && (x = baseTimeStat.standard.timeStamps)){
		if(!this.standard){
			this.standard = {};
		}
		if(!(y = this.standard.timeStamps)){
			y = this.standard.timeStamps = {};
		}
		for(var key in x){
			if(!y[key]){
				y[key] = x[key];
			}
		}
	}

	return this;
};

/**
 * 显式设置一个0时点，作为时延计算的基点（减数）
 *
 * @method
 * @param {object} [od = new Date()] Date instance
 * @return {object} TCISD.TimeStat instance
 *
 *
 */
TCISD.TimeStat.prototype.setZero = function(od){
	if(typeof(od) != "object" || typeof(od.getTime) != "function"){
		od = new Date();
	}
	return this;
};

/**
 * 上报一个时间点统计序列
 *
 * @method
 * @param {string} [baseURL = "http://isdspeed.qq.com/cgi-bin/r.cgi"] 上报的CGI接口
 * @return {object} TCISD.TimeStat instance
 *
 *
 */
TCISD.TimeStat.prototype.report = function(baseURL){
	var _s = TCISD.TimeStat,
		url = [],
		t, z;

	if((t = this.timeStamps).length < 1){
		return this;
	}

	url.push((baseURL && baseURL.split("?")[0]) || _s.config.webServerInterfaceURL);
	url.push("?");

	z = this.zero;
	for(var i = 1, len = t.length; i < len; ++i){
		if(t[i]){
			url.push(i, "=", t[i] - z, "&");
		}
	}

	t = this.flagStr.split("_");
	for(var i = 0, len = _s.config.maxFlagArrayLength; i < len; ++i){
		if(t[i]){
			url.push("flag", i + 1, "=", t[i], "&");
		}
	}

	url.push("sds=", Math.random());
	QZFL.pingSender(url.join(""));
	return this;
};

/**
 *
 *
 * @private
 *
 *
 */
TCISD.TimeStat._instances = {};

/**
 *
 *
 * @private
 *
 *
 */
TCISD.TimeStat._count = 0;

/**
 *
 *
 * @private
 *
 *
 */
TCISD.TimeStat.config = {
	webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/r.cgi",
	defaultFlagArray: [
		175,	//Qzone业务ID
		115,	//Qzone个人中心站点ID
		1		//下属页面ID
	],
	maxFlagArrayLength: 6,
	zero: window._s_ || (new Date())
};

/*****************************************************************************************/

/**
 * @fileoverview 返回码系统发送器
 *
 */


/**
 *
 *
 * @ignore
 *
 *
 */
if(typeof(window.TCISD) == "undefined"){
	window.TCISD = {};
}

/**
 * 简单get请求发送器Async
 *
 * @param {number} [statId = 1] 标识ID,需要IOD itil组分配, 1肯定不对呵呵
 * @param {number} [resultType = 1] 返回码大类型，1成功，2失败
 * @param {number} [returnValue = 1] 返回码，1-10为统一定义字段，不允许自定义使用,目前系统定义的字段如下：
1数据异常
2权限错误
3超时（在规定时间内请求未返回视为超时）
11-99为用户自定义字段
100以上为保留字段

 * @param {object} [opts = {
                        reportRate: 1, //表示该上报类型的次数（数值为1/采样频率）；
比如正确的cgi上报率为1/1000
那么这里的值就为1000
错误的采样为100/100，那么这个值为1
后台系统会自动对这个上报记为num次正确或错误。
这里推荐默认用1，错误和成功采样率一致。

						duration: 1000 //表示本次处理时间 单位ms，可以用此字段记录你某个过程的执行时间，或者绝对时间也可，有效区间是 (0,180000]
                    }] 可选参数
 *
 */
TCISD.valueStat = function(statId, resultType, returnValue, opts){
	//还是异步化一下，不要堵别人主流程吧
	setTimeout(function(){
		TCISD.valueStat.send(statId, resultType, returnValue, opts);
	}, 0);
};

/**
 * 简单get请求发送器Sync
 *
 * @param {number} [statId = 1] 标识ID,需要IOD itil组分配, 1肯定不对呵呵
 * @param {number} [resultType = 1] 返回码大类型，1成功，2失败
 * @param {number} [returnValue = 1] 返回码，1-10为统一定义字段，不允许自定义使用,目前系统定义的字段如下：
1数据异常
2权限错误
3超时（在规定时间内请求未返回视为超时）
11-99为用户自定义字段
100以上为保留字段

 * @param {object} [opts = {
                        reportRate: 1, //表示该上报类型的次数（数值为1/采样频率）；
比如正确的cgi上报率为1/1000
那么这里的值就为1000
错误的采样为100/100，那么这个值为1
后台系统会自动对这个上报记为num次正确或错误。
这里推荐默认用1，错误和成功采样率一致。

						duration: 1000 //表示本次处理时间 单位ms，可以用此字段记录你某个过程的执行时间，或者绝对时间也可，有效区间是 (0,180000]
                    }] 可选参数
 *
 */
TCISD.valueStat.send = function(statId, resultType, returnValue, opts){
	var _c = TCISD.valueStat.config,
		t = _c.defaultParams,
		p,
		url = [];

	statId = statId || t.statId; //这个有风险啊，拿了默认值报上去可不对哦，下面两行也是
	resultType = resultType || t.resultType;
	returnValue = returnValue || t.returnValue;

	opts = opts || t; //这里都是内部人用，就不严谨检查了

	url.push((opts.reportURL || _c.webServerInterfaceURL), "?");
	url.push(
			"flag1=", statId, "&",
			"flag2=", resultType, "&",
			"flag3=", returnValue, "&",
			"1=", opts.reportRate, "&",
			"2=", opts.duration, "&"
		);
	
	url.push("sds=", Math.random());
	QZFL.pingSender(url.join(""));
};

/**
 *
 *
 * @private
 *
 *
 */
TCISD.valueStat.config = {
	webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/v.cgi",
	defaultParams: {
		statId: 1, //标识ID,需要IOD itil组分配, 1肯定不对呵呵
		resultType: 1,	//成功
		returnValue: 11,	//自定义
		reportRate: 1,	//100%采样
		duration: 1000	//自定义时间
	}
};

/*****************************************************************************************/


/**
 * @fileoverview 发送PVUV统计
 *
 */



/**
 *
 *
 * @ignore
 *
 *
 */
if(typeof(window.TCISD) == "undefined"){
	window.TCISD = {};
}


/**
 * 简单get请求发送器Async
 *
 * @param {string} [sDomain = location.hostname] 请求pv统计主虚域名
 * @param {string} [path = location.pathname] 请求pv统计虚路径
 * @param {object} [opts = {
                        referURL: "http://xxxxxxxx", //你需要统计的来源URL，可以随便写，合法的URL即可，这里多说一句，有与qzone这样的域名是 号码.qzone.qq.com的情况，来源会非常多，为了不压垮PGV的存储，这里最好能归类来源域名，虚拟化，下同
						referDomain: "xxxx.xxx.com", //如果你想翻开写，那么可以直接写个来源URL的虚域名
						referPath: "/xxxxx", //如果你想翻开写，那么可以直接写个来源URL的虚路径
						timeout: 500 统计请求发出时延，默认500ms

                    }] 可选参数
 *
 */
TCISD.pv = function(sDomain, path, opts){
	//还是异步化一下，不要堵别人主流程吧
	setTimeout(function(){
		TCISD.pv.send(sDomain, path, opts);
	}, 0);
};

/**
 * 简单get请求发送器Sync
 *
 * @param {string} [sDomain = location.hostname] 请求pv统计主虚域名
 * @param {string} [path = location.pathname] 请求pv统计虚路径
 * @param {object} [opts = {
                        referURL: "http://xxxxxxxx", //你需要统计的来源URL，可以随便写，合法的URL即可，这里多说一句，有与qzone这样的域名是 号码.qzone.qq.com的情况，来源会非常多，为了不压垮PGV的存储，这里最好能归类来源域名，虚拟化，下同
						referDomain: "xxxx.xxx.com", //如果你想翻开写，那么可以直接写个来源URL的虚域名
						referPath: "/xxxxx", //如果你想翻开写，那么可以直接写个来源URL的虚路径
						timeout: 500 统计请求发出时延，默认500ms

                    }] 可选参数
 *
 */
TCISD.pv.send = function(sDomain, path, opts){
	sDomain = sDomain || location.hostname || "-"; //主统计域名
	path = path || location.pathname; //统计路径
	opts = opts || {};
	opts.referURL = opts.referURL || document.referrer;
	
	var t, d, r, _s = TCISD.pv;

	t = opts.referURL.split(_s._urlSpliter);
	t = t[0];
	t = t.split("/");
	d = t[2] || "-";
	r = "/" + t.slice(3).join("/");

	opts.referDomain = opts.referDomain || d; //来源域名
	opts.referPath = opts.referPath || r; //来源URL

	t = document.cookie.match(_s._cookieP);
	if(t && t.length && t.length > 1){
		d = t[1];
	}else{
		d = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
		document.cookie = "pvid=" + d + "; path=/; domain=qq.com; expires=Sun, 18 Jan 2038 00:00:00 GMT;";
	}

	t = [
		_s.config.webServerInterfaceURL,
		"?cc=-&ct=-&java=1&lang=-&pf=-&scl=-&scr=-&tt=-&tz=-8&vs=3.3&",
		"dm=", sDomain, "&",
		"url=", encodeURIComponent(path), "&",
		"rdm=", opts.referDomain, "&",
		"rurl=", encodeURIComponent(opts.referPath), "&",
		"pvid=", d, "&",
		"sds=", Math.random()
	];

	QZFL.pingSender(t.join(""), opts.timeout);

};

/**
 *
 *
 * @private
 *
 *
 */
TCISD.pv._urlSpliter = /[\?\#]/;

/**
 *
 *
 * @private
 *
 *
 */
TCISD.pv._cookieP = /(?:^|;+|\s+)pvid=([^;]*)/i;

/**
 *
 *
 * @private
 *
 *
 */
TCISD.pv.config = {
	webServerInterfaceURL: "http://pingfore.qq.com/pingd"
};

/*****************************************************************************************/

/**
 * @fileoverview 发一个简短get请求的组件
 *
 */


/**
 *
 *
 * @ignore
 *
 *
 */
if(typeof(window.QZFL) == "undefined"){
	window.QZFL = {};
}


/**
 * 简单get请求发送器
 *
 * @param {string} url 请求url
 * @param {number} [t = 500] 请求时延，单位ms
 *
 */
QZFL.pingSender = function(url, t){
	var _s = QZFL.pingSender,
		iid,
		img;

	if(!url){
		return;
	}
	
	iid = "sndImg_" + _s._sndCount++;
	img = _s._sndPool[iid] = new Image();
	img.iid = iid;
	img.onload = img.onerror = (function(t){
		return function(evt){
			QZFL.pingSender._clearFn(evt, t);
		};
	})(img);
	setTimeout(function(){
		img.src = url;
	}, t || 500);
};

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._sndPool = {};

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._sndCount = 0;

/**
 *
 *
 * @private
 *
 *
 */
QZFL.pingSender._clearFn = function(evt, ref){
	evt = event || evt;
	var _s = QZFL.pingSender;
	if(ref){
		_s._sndPool[ref.iid] = ref.onload = ref.onerror = null;
		delete _s._sndPool[ref.iid];
		_s._sndCount--;
		ref = null;
	}
};

