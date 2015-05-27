'use strict';

var _ = require('lodash'),
    angular = require('angular'),
    document = require('document'),
    window = require('window'),

    app = require('./app'),

    communicator = require('./../services/communicator'),
    listManager = require('./../services/listManager'),
    lineManager = require('./../services/lineManager'),

    ListCtrl = require('./../controllers/ListCtrl'),
    ListsCtrl = require('./../controllers/ListsCtrl'),

    io = require('socket.io-client'),
    socket,

    bootstrap;


bootstrap = {
    _started: false,

    config: ['$locationProvider', '$routeProvider', '$provide', function($locationProvider, $routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'lists.html',
            controller: 'ListsCtrl'
        }).when('/list/:id', {
            templateUrl: 'list.html',
            controller: 'ListCtrl'
        }).otherwise({
            redirectTo: '/list'
        });
    }],

    initialize: function () {
        var sailsIO = require('sails.io.js')(io);

        global.sailsIO = sailsIO;
        socket = global.io = sailsIO.connect();

        app .factory('communicator', communicator)
            .factory('listManager', listManager)
            .factory('lineManager', lineManager)
            .controller('ListCtrl', ListCtrl)
            .controller('ListsCtrl', ListsCtrl)
            .config(this.config)
            .run(this.run);

        window.addEventListener('load', this.onLoad.bind(this));

        return this;
    },

    run: [function () {
    }],

    onLoad: function () {
        require('angular-sails');
        socket.connect = function () { return this; };
        socket.on('connect', function () {
            if (!this._started) {
                this._started = true;
                angular.bootstrap(document, ['starter']);
            }
        }.bind(this));
    }
};
Object.create(bootstrap).initialize();
