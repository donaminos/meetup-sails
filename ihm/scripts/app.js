'use strict';

var angular = require('angular'),
    app;

require('angular-route');
require('angular-contenteditable');
require('ui.bootstrap');
app = angular.module('starter', ['ngRoute', 'contenteditable', 'ngSails', 'ui.bootstrap'])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):|data:/);
    }]);

module.exports = app;
