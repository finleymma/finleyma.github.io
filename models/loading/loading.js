'use strict';

define(function(require, exports, modules) {
    var $ = require('zepto'),
        nextPage = require('animate_page'),
		stat = require('stat'),
		statCfg = require('StatCfg'),
        $loadingRate,
        i= 1,
        debug = false;

    /**
     * @func
     * @desc 页面进入动画开始前回调，请在这时候对DOM做初始化，尽量减少这里的操作，防止产生性能问题
     * @param {zepto} $root - 页面的根 DOM 结点，用于限定选择器的作用域
     * @param {number} modelID - 页面 ID 由于聊天页面会多次打开，这里可以区分现在是第几次打开的
     */
    exports.pageWillEnter = function($root, modelID) {
            $loadingRate = $('.loading-rate-text',$root);
    };

    /**
     * @func
     * @desc 页面进入动画结束后回调，在这里绑定侦听器
     */
    exports.pageDidEnter = function() {
        if(debug){
            nextPage();
            return;
        }
        setTimeout(function(){
            nextPage(nextPage.ANIM_NAME.FADE_IN);
        },1300);
    };

    /**
     * @func
     * @desc 页面移除前的回调，请在这时删除侦听器、清除内存
     */
    exports.pageWillremove = function() {
        if(!debug){
            $ = $loadingRate = nextPage = i = null;
        }
    };

});
