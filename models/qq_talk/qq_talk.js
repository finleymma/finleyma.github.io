'use strict'

define(function(require, exports, modules) {
    var $ = require('zepto'),
        nextPage = require('animate_page'),
        iScroll = require('lib/iscroll'),
        initPages = require('uitl/init_pages'),
		stat = require('stat'),
		statCfg = require('StatCfg'),
        $input,
        $inputBox,
        $inputKeyBord,
        $wraper,
        $dialogContiner,
        $footer,
        $showdow,
        isFirst;


    /**
     * @func
     * @desc 页面进入动画开始前回调，请在这时候对DOM做初始化，尽量减少这里的操作，防止产生性能问题
     * @param {zepto} $root - 页面的根 DOM 结点，用于限定选择器的作用域
     * @param {number} modelID - 页面 ID 由于聊天页面会多次打开，这里可以区分现在是第几次打开的
     */
    exports.pageWillEnter = function($root, modelID) {
        //第一次打开
        isFirst = (modelID === 2);
        $wraper = $('#qq_talk-wraper',$root);
        $dialogContiner = $('.qq_talk-main ul',$root);
        $footer = $('.qq_talk-footer',$root);
        $inputBox = $('.qq_talk-footer');
        $inputKeyBord = $('.qq_talk-input-keybord');
        $input = $inputBox.find('.qq_talk-input');
        $showdow = $('.showdow');

    };

    /**
     * @func
     * @desc 页面进入动画结束后回调，在这里绑定侦听器
     */
    exports.pageDidEnter = function() {
        var audio = document.getElementById('mp3');
        var contentHeight = initPages.getpageHeight() - 45 - 47;
        $('.qq_talk-content').css('height', contentHeight);

        var showTalk = function($talk) {
            if($talk.hasClass('J_music')) {
                audio.play();
            }
            $talk.show();
            var top = $talk.position().top;
            $wraper.scrollTop(top);
            var isStop = $talk.hasClass('J_stop');

            var nextTalk = $talk.next();
            if(nextTalk.length>0 && !isStop) {
                setTimeout(function() {
                    showTalk(nextTalk);
                }, 1300);

            }else if($talk.hasClass('J_test')){
                $talk.one('click', function() {
                    nextPage(nextPage.ANIM_NAME.NAV_PUSH);
                });

            }else if($talk.hasClass('J_qzone')) {
                $talk.find('.user-bringbring').one('click', function() {
                    nextPage(nextPage.ANIM_NAME.NAV_PUSH);
                });
            }
        };

        if(isFirst){

            setTimeout(function() {
                showTalk($('.J_qqTalk').first());
            }, 1000);

        }else{

            $wraper.find('.J_first').show();
            var $stop = $('.J_stop');
            $stop.find('.user-bringbring').removeClass('user-bringbring');
            var top = $stop.position().top;
            $wraper.scrollTop(top);

            setTimeout(function() {
                showTalk($stop.next());
            }, 600);

        }
    };
});
