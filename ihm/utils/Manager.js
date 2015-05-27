var _ = require('lodash'),
    Service;

Service = {
    body: {
        _data: null,
        _list: null,

        mergeSailsModel: function (msg, param) {
            var key;

            if (msg.verb === 'updated' && msg.data.name) {
                if (!param && this._data.id && msg.id == this._data.id) {
                    for (key in msg.data) {
                        if (msg.data.hasOwnProperty(key) && !(_.isString(msg.data[key]) && _.isPlainObject(this._data[key]))) {
                            this._data[key] = msg.data[key];
                        }
                    }
                }

                _.each(param ? this._data[param] : this._list, function (line) {
                    if (line.id && msg.id == line.id) {
                        for (key in msg.data) {
                            if (msg.data.hasOwnProperty(key) && !(_.isString(msg.data[key]) && _.isPlainObject(line[key]))) {
                                line[key] = msg.data[key];
                            }
                        }
                    }
                }, this);
            }

            if (msg.verb === 'destroyed') {
                _.each(param ? this._data[param] : this._list, function (line, index) {
                    if (line.id === msg.id) {
                        this._list.splice(index, 1);
                    }
                }, this);
            }

            if (!param && msg.verb === 'created') {
                this._list.push(msg.data);
            }
        },

        validData: function (_data) {
            var forbiddenKeys = ['createdAt', 'updatedAt'],
                data,
                key;

            if (_.isArray(_data)) {
                data = [];

                _.each(_data, function (value) {
                    data.push(this.validData(value));
                }, this);
            } else if (_.isPlainObject(_data)) {
                data = {};

                for (key in _data) {
                    if (_data.hasOwnProperty(key) && key.charAt(0) !== '$' && forbiddenKeys.indexOf(key) < 0) {
                        data[key] = this.validData(_data[key]);
                    }
                }
            } else {
                data = _data;
            }

            return data;
        },

        resetData: function (data) {
            var key;

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    delete data[key];
                }
            }
        }
    },
    create: function () {
        var instance = Object.create(Service.body);
        instance._data = {};
        instance._list = [];
        return instance;
    }
};

module.exports = Service;
