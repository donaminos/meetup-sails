'use strict';

var _ = require('lodash'),
    Manager = require('../utils/Manager'),
    listManager;

listManager = ['$q', 'communicator', function ($q, communicator) {
    var manager = Manager.create();

    _.extend(manager, {
        initialize: function () {
            communicator.on('list', function (msg) {
                this.mergeSailsModel(msg);

                if (msg.verb === 'addedTo' && msg.attribute === 'lines') {
                    if (this._data.id && msg.id == this._data.id) {
                        communicator.get('/line/' + msg.addedId)
                            .success(function (_data) {
                                this._data.lines.push(_data);
                            }.bind(this));
                    }

                    _.each(this._list, function (line) {
                        if (line.id && msg.id == line.id) {
                            communicator.get('/line/' + msg.addedId)
                                .success(function (_data) {
                                    line.lines.push(_data);
                                }.bind(this));
                        }
                    }, this);
                }
            }.bind(this));

            return this;
        },

        get: function (id) {
             communicator.get('/list/' + id)
                .success(function (data) {
                     _.extend(this._data, data);
                 }.bind(this));

            return this._data;
        },

        getList: function (filter) {
            communicator.get('/list' + (!!filter ? '?' + filter : ''))
                .success((function (lists) {
                    this._list.splice(0, this._list.length);
                    lists.forEach(function (list) {
                        this._list.push(list);
                    }.bind(this));
                }).bind(this));

            return this._list;
        },

        save: function (id, _list) {
            var list = _.cloneDeep(_list);

            return communicator.put('/list/' + id, _.omit(this.validData(list), ['id']));
        },

        add: function (_list) {
            var list = _.cloneDeep(_list);
            return communicator.post('/list', _.omit(this.validData(list), ['id']))
                .success(function (list) {
                    this._list.push(_.extend({ lines: [] }, list));
                }.bind(this));
        },

        remove: function (id) {
            return communicator.delete('/list/' + id)
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

module.exports = listManager;
