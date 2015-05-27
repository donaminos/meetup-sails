'use strict';

var _ = require('lodash'),
    Manager = require('../utils/Manager'),
    lineManager;

lineManager = ['$q', 'communicator', function ($q, communicator) {
    var manager = Manager.create();

    _.extend(manager, {
        initialize: function () {
            communicator.on('line', (function (msg) {
                this.mergeSailsModel(msg);
            }).bind(this));

            return this;
        },

        get: function (id) {
             communicator.get('/line/' + id)
                .success(function (data) {
                     _.extend(this._data, data);
                 }.bind(this));

            return this._data;
        },

        getList: function (filter) {
            communicator.get('/line' + (!!filter ? '?' + filter : ''))
                .success((function (lines) {
                    this._list.splice(0, this._list.length);
                    lines.forEach(function (line) {
                        this._list.push(line);
                    }.bind(this));
                }).bind(this));

            return this._list;
        },

        save: function (id, _list) {
            var list = _.cloneDeep(_list);

            return communicator.put('/line/' + id, _.omit(this.validData(list), ['id']));
        },

        add: function (_list) {
            var list = _.cloneDeep(_list);
            return communicator.post('/line', _.omit(this.validData(list), ['id']))
                .success(function (list) {
                    this._list.push(_.extend({ lines: [] }, list));
                }.bind(this));
        },

        remove: function (id) {
            return communicator.delete('/line/' + id)
                .success(function () {
                    this._list.forEach(function (list, index) {
                        if (list.id === id) {
                            this._list.splice(index, 1);
                        }
                    }.bind(this));
                }.bind(this));
        }
    });

    return Object.create(manager).initialize();
}];

module.exports = lineManager;
