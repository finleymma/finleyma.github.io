'use strict'

define(function(require, exports, modules) {
    var $ = require('zepto'),
        nextScreen = require('animate_page'),
		initPages = require('uitl/init_pages'),
		stat = require('stat'),
		statCfg = require('StatCfg'),
		fastClick = require('fastclick');
    fastClick.attach(document.body);
	
	// 数据上报 -- 页面流失数据上报
	// var pageReport = TCISD.markTime(
	//		statCfg.PAGE_REPORT_4.report_id, 
	//		statCfg.PAGE_REPORT_4.report_name, 
	//		statCfg.PAGE_REPORT_4.flag, 
	// );
	// pageReport.report(); //上报数据
	
    var $recommend;
	
	/**
     * @func
     * @desc 根据图片比例和实际宽度设置元素展示高度
     * @param {zepto} $element - 元素
     * @param {number} ratio - 图片宽高比例
     */
	function setElementHeightByRatio($element, ratio) {
		var eleWidth = parseFloat($($element).css('width')) / 100 * initPages.getpageWidth();
		eleWidth = (eleWidth - parseFloat($($element).css('max-width')) < 0) ? eleWidth : parseFloat($($element).css('max-width'));
		var eleHeight = eleWidth /ratio;
		$($element).css('height', eleHeight + 'px');
	}
	
    /**
     * @func
     * @desc 页面进入动画开始前回调，请在这时候对DOM做初始化，尽量减少这里的操作，防止产生性能问题
     * @param {zepto} $root - 页面的根 DOM 结点，用于限定选择器的作用域
     * @param {number} modelID - 页面 ID 由于聊天页面会多次打开，这里可以区分现在是第几次打开的
     * @param {Object} fromLastPage - 上个页面传来的参数
     */
    exports.pageWillEnter = function($root, modelID, fromLastPage) {
        $recommend = $('.recommend', $root);

		$('.percent', $root).css('background', 'url(images/sng_test_result/' + fromLastPage.similarity + '.png) no-repeat');
		$('.percent', $root).css('background-position', 'center');
		$('.percent', $root).css('background-size', 'contain');
		
		/* 设置 图片 高度 */
		var testResultRatio = 254 / 46,
			testResultValueRatio = 476 / 45,
			percentRatio = 154 / 39,
			sngRatio = 600 / 299,
			sngFullNameRatio = 488 / 44,
			detailRatio = 507 / 109,
			recommendRatio = 527 / 80;
		
		setElementHeightByRatio($('.test-result', $root), testResultRatio);
		setElementHeightByRatio($('.test-result-value', $root), testResultValueRatio);
		setElementHeightByRatio($('.percent', $root), percentRatio);
		setElementHeightByRatio($('.sng', $root), sngRatio);
		setElementHeightByRatio($('.sng-fullname', $root), sngFullNameRatio);
		setElementHeightByRatio($('.detail', $root), detailRatio);
		setElementHeightByRatio($('.recommend', $root), recommendRatio);
    };

    /**
     * @func
     * @desc 页面进入动画结束后回调，在这里绑定侦听器
     */
    exports.pageDidEnter = function() {
        setTimeout(function() {
            $recommend.on('click', function() {
                nextScreen(nextScreen.ANIM_NAME.NAV_POP);
            });
        }, 0);
    };

    /**
     * @func
     * @desc 页面移除前的回调，请在这时删除侦听器、清除内存
     */
    exports.pageWillremove = function() {
        $recommend.off('click');
    };
});