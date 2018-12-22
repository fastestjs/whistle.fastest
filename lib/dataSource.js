'use strict';

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var dataSource = new EventEmitter();
dataSource.setMaxListeners(1000);

module.exports = dataSource;