'use strict';

var _ = require('lodash'),
    communicator;

communicator = ['$sails', function ($sails) {
    var manager = {},
        httpVerbs = ['get', 'post', 'put', 'delete'];

    httpVerbs.forEach(function (httpVerb) {
        manager[httpVerb] = function (url, data) {
            return $sails[httpVerb](url, data);
        };
    }, this);

    _.extend(manager, {
        on: function (event, cb) {
            return $sails.on(event, cb);
        }
    });

    return Object.create(manager);
}];

module.exports = communicator;
