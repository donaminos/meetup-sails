'use strict';

var _ = require('lodash'),
    ListsCtrl;

ListsCtrl = ['$scope', '$routeParams', 'listManager', function ($scope, $routeParams, listManager) {
    _.extend($scope, {
        lists: listManager.getList(),

        add: function () {
            listManager.add({
                name: 'new list'
            });
        },

        remove: function (list) {
            listManager.remove(list.id);
        },

        change: function (list) {
            listManager.save(list.id, list);
        }
    });
}];

module.exports = ListsCtrl;
