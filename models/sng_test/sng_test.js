'use strict'

define(function(require, exports, modules) {
    var $ = require('zepto'),
        nextScreen = require('animate_page'),
		fastClick = require('fastclick'),
		initPages = require('uitl/init_pages'),
		stat = require('stat'),
		statCfg = require('StatCfg'),
		$result,
		$brandItem;
		
    fastClick.attach(document.body);

	// 数据上报 -- 页面流失数据上报
	// var pageReport = TCISD.markTime(
	//		statCfg.PAGE_REPORT_3.report_id, 
	//		statCfg.PAGE_REPORT_3.report_name, 
	//		statCfg.PAGE_REPORT_3.flag, 
	// );
	// pageReport.report(); //上报数据	
	
    /**
     * @func
     * @desc 获取选中的产品数量
     */
    function getSelectedCount() {
        var $selected = $brandItem.parent().find('.active');
        return $selected.length;
    }
	
    /**
     * @func
     * @desc 上报用户选中产品数据
     */
    function reportUserFamiliarProduct() {
        var flags = [];
		var $selectedIcons = $('.brand-item');
		for(var i = 0;i<9;i++) {
			if($selectedIcons[i].hasClass('.active')) {
				var f = "statCfg.PRODUCT_REPORT_" + i + ".flag";
				var productReport = TCISD.markTime(
					statCfg[eval("f")].report_id, 
					statCfg[eval("f")].report_name, 
					statCfg[eval("f")].flag
				);
				productReport .report(); //上报数据
			}
		}
    }
	
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
        $result = $('.test-result', $root);
        $brandItem = $('.brand-item', $root);
		
		/* 设置产品标题高度 */
		var titleDownRatio = 482 / 186;
		setElementHeightByRatio($('.test-title-down', $root), titleDownRatio);
		/* 设置子标题高度 */
		var subTitleRatio = 536 / 42;
		setElementHeightByRatio($('.test-sub-title', $root), subTitleRatio);
		
		
		/* brand宽度 */
		var $brand = $('.brands', $root);
		var brandWidth = parseFloat($brand.css('width')) / 100 * initPages.getpageWidth();
		brandWidth = (brandWidth - parseFloat($brand.css('max-width')) < 0) ? brandWidth : parseFloat($brand.css('max-width'));
		
		/* 设置icon布局 */
		var iconWidth = brandWidth * 155 / 540;
		$brandItem.css('width', iconWidth + 'px');
		$brandItem.css('height', iconWidth + 'px');
		
		$brandItem.each(function(index, el) {
			$(el).css('left', (parseInt(index%3) * brandWidth * 192.5 / 540) + 'px');
			$(el).css('top', (parseInt(index/3) * brandWidth * 192.5 / 540) + 'px');
        });
	
		/* 获取结果按钮高度 */
		var resultWidth = parseFloat($result.css('width')) / 100 * initPages.getpageWidth();
		resultWidth = (resultWidth - parseFloat($result.css('max-width')) < 0) ? resultWidth : parseFloat($result.css('max-width'));
		var resultHeight = (resultWidth * 80 / 527);
		$result.css('height', resultHeight + 'px');
		
		/* 设置brands高度 */
		var brandHeight = (brandWidth + resultHeight) + 10 + 20;//brandWidth + resultHeight + resultBottom + resultPaddingTop
		$brand.css('height', brandHeight + 'px');
		
    };

    /**
     * @func
     * @desc 页面进入动画结束后回调，在这里绑定侦听器
     */
    exports.pageDidEnter = function() {

		$result.on('click', function() {
			//上报数据
			//reportUserFamiliarProduct();
            
			//跳转到下页
			nextScreen({
                'similarity': getSelectedCount()
            }, nextScreen.ANIM_NAME.FADE_IN);
        });
		
        $brandItem.on('click', function() {
            $(this).toggleClass('active');

            var selectedCount = getSelectedCount();
            if(selectedCount == 0) {
                $result.hide();
            }else{
                $result.show();
            }
        });
    };

    /**
     * @func
     * @desc 页面移除前的回调，请在这时删除侦听器、清除内存
     */
    exports.pageWillremove = function() {
        $result.off('click');

        $brandItem.off('click');
    };

});