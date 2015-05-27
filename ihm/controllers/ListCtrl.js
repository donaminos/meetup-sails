'use strict';

var _ = require('lodash'),
    ListCtrl;

ListCtrl = ['$scope', '$routeParams', 'lineManager', function ($scope, $routeParams, lineManager) {
    var id = $routeParams.id;

    _.extend($scope, {
        lines: lineManager.getList('list=' + id),

        add: function () {
            lineManager.add({
                name: 'new line',
                done: false,
                list: id
            });
        },

        remove: function (line) {
            lineManager.remove(line.id);
        },

        change: function (line) {
            lineManager.save(line.id, line);
        }
    });
}];

module.exports = ListCtrl;
