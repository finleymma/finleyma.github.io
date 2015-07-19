/**
 * 页面切换模块
 */

define(function(require, exports, modules) {
    var $ = require('zepto'),
        initPages = require('init_pages'),
        modelsConfig = require('../../models/models_config'),
        currPageID = 0,
        $pageContainer = $('#page-container'),

        //页面DOM
        $currPageDOM = $('.page', $pageContainer),
        $nextPageDOM,

        //页面js模块
        currModel = {},
        nextModel,

        //页面css的DOM
        $currStyle, $nextStyle,

        $head = $('head'),
        //xss_clean
        __a = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt',
            '"': '&quot',
            "'": '&#39;'
        },
        __b = /[&<>"']/g;


    var transitionSupport;

    /**
     * 检查浏览器支持的 transform 属性
     * @return {string} 支出的属性
     */
    function checkTransitionSupport() {
        if (transitionSupport === undefined) {
            var checkDiv = document.createElement('div');
            if (checkDiv.style.transform !== undefined) {
                transitionSupport = 'transform';
            } else if (checkDiv.style.webkitTransform !== undefined) {
                transitionSupport = '-webkit-transform';
            } else if (checkDiv.style.msTransform !== undefined) {
                transitionSupport = '-ms-transform';
            } else {
                transitionSupport = '';
            }
            checkDiv = null;
        }
        return transitionSupport;
    }
    var trans = checkTransitionSupport();


    /**
     * @func
     * @desc 页面切换函数
     * @param {Object} toNextPage - 可选参数，需要提交给下一页的参数
     * @param {string} animateName - 切换动画名称
     */
    var nextScreen = function(toNextPage, animateName) {

        //模仿jQuery的写法，对参数进行调整
        if (typeof toNextPage === "string") {
            animateName = toNextPage;
        }

        var pageID = ++currPageID;
        jumpToPage(toNextPage, animateName, pageID);

    };



    var jumpToPage = function(toNextPage, animateName, pageID) {
        var nextPageName = htmlDecode(modelsConfig[pageID]),
            jsPath = '../../models/' + nextPageName + '/' + nextPageName,
            cssPath = 'models/' + nextPageName + '/' + nextPageName + '.css',
            htmlPath = 'models/' + nextPageName + '/' + nextPageName + '.html';

        $.when(
                loadCssOrHtml(cssPath),
                loadCssOrHtml(htmlPath),
                loadJs(jsPath, toNextPage, animateName)
            )
            .done(onAsyncModelsLoad)
            .fail(function() {
                console.log('Oops! 页面模块加载失败了，这可能是由于 models_config 写错了。或者css没有编译');
            });
    }

    /**
     * @param  {string} jsPath 需要加载的模块名
     * @return {zepto.promise}
     */
    var loadJs = function(jsPath, toNextPage, animateName) {
        var deferred = $.Deferred();
        require.async(jsPath, function(model) {
            deferred.resolve(model, toNextPage, animateName);
        });
        return deferred.promise();
    };

    /**
     * @param  {string} path 需要加载的css\html路径
     * @return {zepto.promise}
     */
    var loadCssOrHtml = function(path) {
        return $.ajax({
            url: path
        });
    }

    /**
     * @func
     * @desc 页面 css、html、js 加载成功后的回调
     * @param  {arguments} 接收 ajax 回调的参数
     * @param  {arguments} 接收 ajax 回调的参数
     * @param  {Object} 接收 seajs 异步加载来的模块
     */
    var onAsyncModelsLoad = function(css, html, model) {

        nextModel = model[0];
        var toNextPage = model[1];
        initHtml(html[0]);

        var animateName = model[2]

        //生命周期:动画开始
        nextModel.pageWillEnter && nextModel.pageWillEnter($nextPageDOM, currPageID, toNextPage);

        // 动画
        if (animateFunction[animateName]) {
            animateFunction[animateName](onAnimateFinish);
        } else {
            $nextPageDOM.show();
            $currPageDOM.hide();

            onAnimateFinish();
        }

    };

    /**
     * 动画名字
     */
    var NAV_PUSH = 'push',
        NAV_POP = 'pop',
        FADE_IN = 'fadeIn';

    nextScreen.ANIM_NAME = {
        NAV_PUSH: NAV_PUSH,
        NAV_POP: NAV_POP,
        FADE_IN: FADE_IN
    };

    /**
     * 动画名字对应的动画函数
     */
    var animateFunction = {

        push: function(callback) {

            if (trans !== '') {
                var tagObj = {};
                tagObj[trans] = 'translate(0px,0) translateZ(0)';

                $nextPageDOM.css({
                        display: 'block',
                        position: 'absolute',
                        zIndex: '50',
                    }).css(trans, 'translate(' + initPages.getpageWidth() + 'px,0) translateZ(0)')
                    .animate(tagObj, 200, 'ease', function() {
                        $currPageDOM.hide();
                        callback();
                    });

            } else {


                $nextPageDOM.css({
                    display: 'block',
                    position: 'absolute',
                    right: '-100%',
                    zIndex: '50',
                }).animate({
                    right: '0%'

                }, 200, 'ease', function() {
                    $currPageDOM.hide();
                    callback();
                });

            }
        },
        pop: function(callback) {
            $nextPageDOM.show();
            if (trans !== '') {
                var tagObj = {};
                tagObj[trans] = 'translate(' + initPages.getpageWidth() + 'px,0) translateZ(0)';
                $currPageDOM
                    .css({
                        display: 'block',
                        position: 'absolute',
                        // right: '0%',
                        // 
                        zIndex: '50',
                    })
                    .css(trans, 'translate(0px,0) translateZ(0)')
                    .animate(tagObj, 200, 'ease-in', function() {
                        callback();
                    });


            } else {
                $currPageDOM.css({
                    display: 'block',
                    position: 'absolute',
                    right: '0%',
                    zIndex: '50',
                }).animate({
                    right: '-100%'
                }, 200, 'ease-in', function() {
                    callback();
                });
            }
        },
        fadeIn: function(callback) {

            $nextPageDOM.css({
                display: 'block',
                opacity: 0,
                position: 'absolute',
                zIndex: '50'
            }).animate({
                opacity: 1
            }, 500, callback);

            // $currPageDOM.css({
            //     zIndex: '0'
            // }).animate(200);

        }
    };

    /**
     * @func
     * @desc 动画完成后的回调
     */
    var onAnimateFinish = function() {
        //生命周期:动画完成
        nextModel.pageDidEnter && nextModel.pageDidEnter();

        //生命周期:移除模块
        currModel.pageWillremove && currModel.pageWillremove();

        $currPageDOM.remove();
        $currStyle && $currStyle.remove();
        //TODO: 模块卸载

        //页面DOM
        $currPageDOM = $nextPageDOM;
        currModel = nextModel;
        $currStyle = $nextStyle;
    }

    var initHtml = function(html) {
        //为什么不用 .wrap() ？DOM插入前 warp() 无效。http://www.css88.com/doc/zeptojs_api/#wrap
        $nextPageDOM = $('<section class="page" style="display:none">' + html + '</section>');
        $pageContainer.append($nextPageDOM);
        initPages.initSinglePage($nextPageDOM);
    }

    var htmlDecode = function(string) {
        return string.replace(__b, function(m) {
            return __a[m];
        })
    }



    /**
     * 提供给测试用的，快速跳转到某页的函数
     * @param  {number} id 页面id
     * @return {[type]}    [description]
     */
    nextScreen.fastJumpTo = function(id, animateName) {
        jumpToPage({}, animateName, id);
        currPageID = id;
    }

    /**
     * 检查当前页面是否屏蔽滚动条
     * @return {boolean} 屏蔽滚动条
     */
    nextScreen.disableScroll = function() {
        return currPageID !== 6;
    };


    modules.exports = nextScreen;

});
