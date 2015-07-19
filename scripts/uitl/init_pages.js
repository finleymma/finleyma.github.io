define(function(require, exports, modules) {

    // 隐藏国产浏览器顶栏（iOS UC有BUG）
    window.scrollTo(0, 1);

    var $ = require('zepto'),
        pageWitdh = window.innerWidth, //document.documentElement.clientWidth,
        pageHeight = window.innerHeight, //document.documentElement.clientHeight,
        $pages = $('.container'),
        pageArr = $pages.find('.page'),
        pageCount = pageArr.length,
        initPage = function() {
            $pages.css({
                'width': pageWitdh * pageCount + 'px',
                'height': pageHeight + 'px'
            });
            pageArr.css({
                'width': pageWitdh + 'px',
                'height': pageHeight + 'px'
            });
            pageArr[0].style.display = 'block'; //兼容android 和 ios
        };

    exports.getpageWidth = function() {
        return pageWitdh;
    };

    exports.getpageHeight = function() {
        return pageHeight;
    };

    /**
     * @param  {zepto} 需要初始化的页面
     */
    exports.initSinglePage = function($pageSection) {
        $pageSection.css({
            'width': pageWitdh + 'px',
            'height': pageHeight + 'px'
        });
    };

    modules.exports.init = initPage;
})
