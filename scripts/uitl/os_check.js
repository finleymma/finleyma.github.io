/**
 * 用户系统平台检验 
 */
define(function(require, exports, modules) {
    modules.exports = function() {
        var ua = navigator.userAgent,
            isQB = /(?:MQQBrowser|QQ)/.test(ua),
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isChrome = /(?:Chrome|CriOS)/.test(ua),
            isIpad = /(?:iPad|PlayBook)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isFireFox && /(?:Tablet)/.test(ua)),
            isSafari = /(?:Safari)/.test(ua),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isOpen = /(?:Opera Mini)/.test(ua),
            isUC = /(?:UCWEB|UCBrowser)/.test(ua),
            isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isQB: isQB,
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid: isAndroid,
            isPc: isPc,
            isOpen: isOpen,
            isUC: isUC,
            isIpad: isIpad
        };
    }();
});
