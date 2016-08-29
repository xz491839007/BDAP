requirejs.config({
    baseUrl: '/static/',
    paths: {
        jquery: 'empty:',
        common:'js/common',
        'jquery.bootstrap' : 'other/bootstrap/js/bootstrap.min',
        app : 'other/dist/js/app.min',
        d3 : 'other/d3/d3.v3.min',
        'jquery.datetimepicker' : 'other/bootstrap/js/bootstrap-datetimepicker.min',
        'quickSearch' : 'other/quickSearch/quickSearch',
        'jquery.ztree.core':'other/plugins/ztree/jquery.ztree.core-3.5',
        'jquery.ztree.excheck':'other/plugins/ztree/jquery.ztree.excheck-3.5',
        'jquery.ztree.exedit':'other/plugins/ztree/jquery.ztree.exedit-3.5'
    },
    shim : {
        common:{
            deps : [ 'jquery' ],
            exports : 'common'
        },
        quickSearch:{
            deps : [ 'jquery' ],
            exports : 'quickSearch'
        },
        'jquery.bootstrap' : {
            deps : [ 'jquery' ],
            exports : 'jquery.bootstrap'
        },
        app:{
            deps : [ 'jquery'],
            exports : 'app'
        },
        'jquery.ztree.core': {
            deps: ['jquery']
        },
        'jquery.ztree.excheck':{
            deps : [ 'jquery']
        },
        'jquery.ztree.exedit': {
            deps: ['jquery']
        }
    }
});