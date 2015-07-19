/**
 * 上报平台参数
 */
define(function(require, exports, modules) {
    modules.exports = function() {
        return {
			/* 页面流失率配置参数 */
            'PAGE_REPORT_1': {
				'report_id'	 : 1,
				'report_name': 'PAGE_REPORT_LOADING',
				'flag'		 : '1'
			},
			'PAGE_REPORT_2': {
				'report_id'	 : 2,
				'report_name': 'PAGE_REPORT_QQ_TALK1',
				'flag'		 : '2'
			},
			'PAGE_REPORT_3': {
				'report_id'	 : 3,
				'report_name': 'PAGE_REPORT_SNG_TEST',
				'flag'		 : '3'
			}, 
			'PAGE_REPORT_4': {
				'report_id'	 : 4,
				'report_name': 'PAGE_REPORT_SNG_TEST_RESULT',
				'flag'		 : '4'
			},
			'PAGE_REPORT_5': {
				'report_id'	 : 5,
				'report_name': 'PAGE_REPORT_QQ_TALK2',
				'flag'		 : '5'
			},
			'PAGE_REPORT_6': {
				'report_id'	 : 6,
				'report_name': 'PAGE_REPORT_Q_ZONE',
				'flag'		 : '6'
			},
			'PAGE_REPORT_7': {
				'report_id'	 : 7,
				'report_name': 'PAGE_REPORT_ENDING',
				'flag'		 : '7'
			},
			/* 产品熟悉度数据上报参数 */
			'PRODUCT_REPORT_0': {
				'report_id'	 : 8,
				'report_name': 'PRODUCT_REPORT_Q_ZONE',
				'flag'		 : '8'
			},
			'PRODUCT_REPORT_1': {
				'report_id'	 : 9,
				'report_name': 'PRODUCT_REPORT_QQ_MUSIC',
				'flag'		 : '9'
			},
			'PRODUCT_REPORT_2': {
				'report_id'	 : 10,
				'report_name': 'PRODUCT_REPORT_PENGUINFM',
				'flag'		 : '10'
			},
			'PRODUCT_REPORT_3': {
				'report_id'	 : 11,
				'report_name': 'PRODUCT_REPORT_LIGHTALK',
				'flag'		 : '11'
			},
			'PRODUCT_REPORT_4': {
				'report_id'	 : 12,
				'report_name': 'PRODUCT_REPORT_QQ',
				'flag'		 : '12'
			},
			'PRODUCT_REPORT_5': {
				'report_id'	 : 13,
				'report_name': 'PRODUCT_REPORT_TENGXUNKETANG',
				'flag'		 : '13'
			},
			'PRODUCT_REPORT_6': {
				'report_id'	 : 14,
				'report_name': 'PRODUCT_REPORT_QQVIP',
				'flag'		 : '14'
			},
			'PRODUCT_REPORT_7': {
				'report_id'	 : 15,
				'report_name': 'PRODUCT_REPORT_TENGXUNWEIYUN',
				'flag'		 : '15'
			},
			'PRODUCT_REPORT_8': {
				'report_id'	 : 16,
				'report_name': 'PRODUCT_REPORT_GREENDIAMOND',
				'flag'		 : '16'
			},
			/* SNG部门兴趣点数据上报参数 */
			'SNG_ENV_REPORT_1': {
				'report_id'	 : 17,
				'report_name': 'SNG_ENV_REPORT_CANTEEN',
				'flag'		 : '17'
			},
			'SNG_ENV_REPORT_2': {
				'report_id'	 : 18,
				'report_name': 'SNG_ENV_REPORT_WORKPLACE',
				'flag'		 : '18'
			}			
        };
    }();
});

