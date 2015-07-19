'use strict';

define(function(require, exports, modules) {
    var $ = require('zepto'),
		stat = require('stat'),
		statCfg = require('StatCfg'),
        $endingShare;
			
	// 数据上报 -- 页面流失数据上报
	// var pageReport = TCISD.markTime(
	//		statCfg.PAGE_REPORT_7.report_id, 
	//		statCfg.PAGE_REPORT_7.report_name, 
	//		statCfg.PAGE_REPORT_7.flag, 
	// );
	// pageReport.report(); //上报数据
	
    /**
     * @func
     * @desc 页面进入动画开始前回调，请在这时候对DOM做初始化，尽量减少这里的操作，防止产生性能问题
     * @param {zepto} $root - 页面的根 DOM 结点，用于限定选择器的作用域
     * @param {number} modelID - 页面 ID 由于聊天页面会多次打开，这里可以区分现在是第几次打开的
     */
    exports.pageWillEnter = function($root, modelID) {
        $endingShare = $('.ending-share');
    };

    /**
     * @func
     * @desc 页面进入动画结束后回调，在这里绑定侦听器
     */
    exports.pageDidEnter = function() {
        $('.ending-wrapper').click(function(){
            $endingShare.addClass('ending-shadow-share');
        });
    };

    /**
     * @func
     * @desc 页面移除前的回调，请在这时删除侦听器、清除内存
     */
    exports.pageWillremove = function() {

    };

});
