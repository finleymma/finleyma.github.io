'use strict'

define(function(require, exports, modules) {
    var nextPage = require('animate_page'),
        iscroll = require('iscroll'),
        initPages = require('init_pages'),
        os = require('os_check'),
        stat = require('stat'),
        statCfg = require('StatCfg'),
        $rootEle,
        $wrapper,
        $mask,
        $coverImg,
        $zoomInListWapper, $zoomInList,

        ACTION_BAR_HEIGHT = initPages.getpageWidth() / 640 * 84, //顶部状态栏高度


        IMG_WIDTH = 100, //缩略图宽高
        ANIMAT_TIME = 200, //动画时间

        listScroll, //滚动条
        zoomInScroll, //图片列表

        zoomInPage, //当前放大的页面编号，0开始

        $imgArr //大图展示图片列表 
    ;

    /**
     * @func
     * @desc 页面进入动画开始前回调，请在这时候对DOM做初始化，尽量减少这里的操作，防止产生性能问题
     * @param {zepto} $root - 页面的根 DOM 结点，用于限定选择器的作用域
     * @param {number} modelID - 页面 ID 由于聊天页面会多次打开，这里可以区分现在是第几次打开的
     * @param {Object} fromLastPage - 上个页面传来的参数
     */
    exports.pageWillEnter = function($root, modelID, fromLastPage) {
        $rootEle = $root;
        $wrapper = $('.wrapper', $rootEle);
        $mask = $('.mask', $rootEle);
        $coverImg = ($('.cover-img', $rootEle));
        $zoomInListWapper = $('.zoom-in-list-wapper', $rootEle);
        $zoomInList = $('.zoom-in-list', $rootEle);
        $wrapper.css('top', ACTION_BAR_HEIGHT);

    };

    /**
     * @func
     * @desc 页面进入动画结束后回调，在这里绑定侦听器
     */
    exports.pageDidEnter = function() {
        //主 listScroll
        $wrapper.css('height', initPages.getpageHeight() - ACTION_BAR_HEIGHT + 'px');
        $wrapper.css('top', ACTION_BAR_HEIGHT);
        listScroll = new IScroll($wrapper[0], {
            mouseWheel: true
        });

        //放大的  Scroll
        zoomInScroll = new IScroll($zoomInListWapper[0], {
            scrollX: true,
            scrollY: false,
            snap: true
        });

        //按下放大
        $('.next-page', $rootEle).one('click', function() {
            nextPage();
        });


        $mask.click(zoomOut);
        $coverImg.click(zoomOut);
        $zoomInListWapper.click(zoomOut);

        $('.q_zone-table-view').on('click', '.zoom-in-img', zoomIn);
    };

    function zoomOut(e) {

        if (os.isAndroid) {
            $coverImg.css({
                opacity: 1
            }).animate({
                opacity: 0
            }, ANIMAT_TIME);
        } else {
            var data = $coverImg.data('zoomInData');
            $coverImg.show();
            $coverImg.animate({
                top: data.top + 'px',
                left: data.left + 'px',
                width: IMG_WIDTH + 'px',
                height: IMG_WIDTH + 'px'
                    // opacity: 0
            }, ANIMAT_TIME, function() {
                $coverImg.hide();
            });
        }

        $mask.animate({
            opacity: 0
        }, ANIMAT_TIME, function() {
            $mask.hide();
        });

        $zoomInListWapper.hide();
    }

    function zoomIn(e) {
        var $this = $(this);

        if (os.isAndroid) {
            $coverImg.css({
                width: initPages.getpageWidth() + 'px',
                height: initPages.getpageHeight() + 'px',
                opacity: 0,
                display: 'block',
                backgroundImage: 'url(' + $this.attr('data-big-img') + ')',
            }).animate({
                opacity: 1
            }, ANIMAT_TIME);
        } else {
            //浮动img
            $coverImg.css({
                top: this.offsetTop + listScroll.y + ACTION_BAR_HEIGHT + 'px',
                left: this.offsetLeft + 'px',
                width: IMG_WIDTH + 'px',
                height: IMG_WIDTH + 'px',
                display: 'block',
                opacity: 1,
                backgroundImage: 'url(' + $this.attr('data-big-img') + ')',
                // backgroundImage: 'url(' + $this.attr('data-big-img') + ')',
            }).animate({
                top: 0 + 'px',
                left: 0 + 'px',
                width: initPages.getpageWidth() + 'px',
                height: initPages.getpageHeight() + 'px'
            }, ANIMAT_TIME);
        }
        $coverImg.data('zoomInData', {
            top: this.offsetTop + listScroll.y + ACTION_BAR_HEIGHT,
            left: this.offsetLeft
        });

        //遮罩背景
        $mask.css({
            display: 'block',
            opacity: 0
        });
        $mask.animate({
            opacity: 1
        }, ANIMAT_TIME, initZoomIn);

        $imgArr = $this.parent('.q_zone-cell-photo').children();
        for (var i = 0, len = $imgArr.length; i < len; i++) {
            if ($imgArr[i] === this) {
                zoomInPage = i;
            }
        }

        $zoomInListWapper.css({
            opacity: 0,
            zIndex: 100
        });
    }


    function initZoomIn() {

        $zoomInList.html('');

        $imgArr.each(function(index, el) {
            var $newDiv = $('<div class="zoom-in-item"  >')

            $zoomInList.append($newDiv);
            $newDiv.css({
                background: 'no-repeat center center',
                backgroundImage: 'url(' + $(el).attr('data-big-img') + ')',
                backgroundSize: 'contain',
                width: initPages.getpageWidth() + 'px',
                height: initPages.getpageHeight() + 'px',
                'float': 'left'
            });

        });
        $zoomInList.css('width', $imgArr.length + '00%');

        $zoomInListWapper.show();
        zoomInScroll.refresh();
        zoomInScroll.goToPage(zoomInPage, 0, 0);



        //防闪烁
        setTimeout(function() {

            $zoomInListWapper.css({
                opacity: 1,
                zIndex: 400
            });
            $coverImg.hide();
        }, 300);

    }

    /**
     * @func
     * @desc 页面移除前的回调，请在这时删除侦听器、清除内存
     */
    exports.pageWillremove = function() {

    };
});
