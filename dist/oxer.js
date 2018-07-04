var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function Oxer(option) {
    var context;
}
var context = (function () {
    function context() {
        this.dataStorage = new dataStorage(this);
    }
    context.prototype.processor = function () {
        this.dataStorage.dataProcess();
    };
    context.prototype.processProp = function (dataObject, dataPropName) {
        var data = this.data;
        if (data) {
            for (var propName in data) {
                if (data.hasOwnProperty(propName)) {
                    var curObj = data[propName];
                    var dataFullKey = dataPropName && (dataPropName + '.' + propName) || propName;
                    if (typeof curObj == 'object' && !(curObj instanceof Array)) {
                        this.processProp(dataObject, dataFullKey);
                        continue;
                    }
                    else {
                        this.watcher(dataObject, propName, dataFullKey);
                    }
                }
            }
        }
    };
    context.prototype.getFullKey = function (option) {
        var key = '';
        if (option && option.bind) {
            if (option.parent && option.parent.bind) {
                key = this.getFullKey(option.parent) + "." + option.bind;
            }
            else {
                key = option.bind;
            }
        }
        return key;
    };
    context.prototype.watcher = function (dataObj, dataKey, dataFullKey) {
        var contextPointer = this;
        Object.defineProperty(dataObj, dataKey, {
            get: function () {
                return this[dataKey];
            },
            set: function (val) {
                this[dataKey] = val;
                contextPointer.watcherTable && contextPointer.watcherTable.forEach(function (item) {
                    item.func(item.el, val);
                });
            },
            enumerable: true,
            configurable: true
        });
    };
    return context;
}());
var dataStorage = (function () {
    function dataStorage(_context) {
        this.context = _context;
    }
    dataStorage.prototype.dataProcess = function () {
        var data = this.context.data;
        if (data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var element = data[key];
                    if (typeof element == 'object' && !(element instanceof Array)) {
                        continue;
                    }
                    else {
                    }
                }
            }
        }
    };
    return dataStorage;
}());
var oxerdata = (function (_super) {
    __extends(oxerdata, _super);
    function oxerdata() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    oxerdata.prototype.getValue = function (key) {
        var obj = this;
        if (obj && key) {
            var dataKeyStack = key.split('.').reverse();
            var targetProp = obj;
            while (dataKeyStack.length > 0) {
                var _key = dataKeyStack.pop();
                targetProp = targetProp[_key];
            }
            return targetProp;
        }
    };
    oxerdata.prototype.setValue = function (key, value) {
        var obj = this;
        if (obj && key) {
            var dataKeyStack = key.split('.').reverse();
            var targetProp = obj;
            while (dataKeyStack.length > 0) {
                var _key = dataKeyStack.pop();
                if (dataKeyStack.length > 0)
                    targetProp = targetProp[_key];
                else
                    targetProp[_key] = value;
            }
            return targetProp;
        }
    };
    return oxerdata;
}(Object));
if (!Object.prototype['clone']) {
    Object.defineProperty(Object.prototype, 'clone', {
        value: function () {
            if (!this) {
                throw new TypeError('Cannot read property "clone" of undefined ');
            }
            var _this = this;
            var o = new Object();
            Object.keys(_this).forEach(function (item) {
                if (typeof _this[item] === "object")
                    o[item] = _this[item];
                else
                    o[item] = _this[item];
            });
            return o;
        }
    });
}
if (!Object.prototype['extend']) {
    Object.defineProperty(Object.prototype, 'extend', {
        value: function (extObj) {
            if (!this) {
                throw new TypeError('Cannot read property "extend" of undefined ');
            }
            var _this = this;
            var o = new Object();
            Object.keys(extObj).forEach(function (item) {
                if (_this.hasOwnProperty(item)) {
                    if (typeof _this[item] === "object") {
                        _this[item].extend(extObj[item]);
                    }
                }
                else {
                    _this[item] = extObj[item];
                }
            });
            return o;
        }
    });
}
