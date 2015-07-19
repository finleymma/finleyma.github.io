define(function(require) {

    var zepto = require('zepto');
    var initPage = require('init_pages'),
        nextPage = require('animate_page'),
		stat = require('stat'),
		statCfg = require('StatCfg');

    initPage.init();

    $(document.body).on('touchstart', function(e) {
        if (!nextPage.disableScroll()) {
            e.preventDefault();
        }
    });

    nextPage();

});
