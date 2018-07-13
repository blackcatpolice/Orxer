function Oxer(_option) {
    var option = new oxerOption(_option);
    for (var key in option) {
        if (option.hasOwnProperty(key)) {
            var item = option[key];
            switch (key) {
                case 'data':
                    processData(item);
                    break;
                case 'enableDebug':
                    break;
                case 'enableRoute':
                    break;
                case 'nodes':
                    processNodes(item);
                    break;
                default:
                    break;
            }
        }
    }
    function processData(data) {
        __loopProperty__(data);
    }
    function __loopProperty__(data, dataName) {
        if (!data) {
            console.warn('data is null');
            return;
        }
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var dataItem = data[key];
                var fullKeyName = dataName && (dataName + '.' + key) || key;
                if (typeof dataItem == 'object' && !(dataItem instanceof Array)) {
                    __loopProperty__(dataItem, fullKeyName);
                }
                else {
                    __setPropertyWatcher__(data, key, fullKeyName);
                }
            }
        }
    }
    function __setPropertyWatcher__(obj, key, fullKeyName) {
        var _this = this;
        var tmpValue = obj[key];
        Object.defineProperty(obj, key, {
            get: function () {
                return _this[key];
            },
            set: function (val) {
                _this[key] = val;
                if (option.watchTable[fullKeyName]) {
                    option.watchTable[fullKeyName].forEach(function (watchItem) {
                        watchItem.func(watchItem.ele, val);
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        obj[key] = tmpValue;
    }
    function processNodes(nodes) {
        switch (true) {
            case typeof nodes == 'string':
                var _ele = document.createElement("span");
                _ele.innerText = nodes;
                document.body.appendChild(_ele);
                break;
            case !Array.isArray(nodes):
                document.body.appendChild(nodes(option));
                break;
            case Array.isArray(nodes):
                nodes.forEach(function (nodeItem) {
                    document.body.appendChild(nodeItem(option));
                });
                break;
            default:
                break;
        }
    }
}
var oxerElement = (function () {
    function oxerElement(tagName, slot) {
        this.slot = slot;
        this.tagName = tagName;
    }
    oxerElement.createInstance = function (tagName, slot) {
        return new oxerElement(tagName, slot);
    };
    oxerElement.prototype.createElement = function () {
        var _this = this;
        return function (option) {
            _this.option = option;
            var _ele = document.createElement(_this.tagName);
            _this.processSlot(_ele);
            return _ele;
        };
    };
    oxerElement.prototype.processSlot = function (element) {
        var _this = this;
        Object.keys(this.slot).forEach(function (slotItemKey) {
            var slotItem = _this.slot[slotItemKey];
            switch (slotItemKey) {
                case 'event':
                    break;
                case 'data':
                    break;
                case 'class':
                    break;
                case 'bind':
                    _this.slotBind(element);
                    break;
                case 'nodes':
                    break;
                default:
                    break;
            }
        });
    };
    oxerElement.prototype.slotBind = function (element) {
        var key = this.slotBindFullKey(this.slot);
        var currentValue = this.getSlotBindValue(key);
        this.processBindProcessor(element, currentValue);
        if (!this.option.watchTable[key]) {
            this.option.watchTable[key] = [];
        }
        this.option.watchTable[key].push({
            ele: element,
            func: this.processBindProcessor
        });
    };
    oxerElement.prototype.processBindProcessor = function (element, value) {
        if (this.slot.bindProcessor) {
            if (this.slot.bindProcessor instanceof Array) {
                this.slot.bindProcessor.forEach(function (_processor) {
                    _processor(element, value);
                });
            }
            else {
                this.slot.bindProcessor(element, value);
            }
        }
    };
    oxerElement.prototype.slotBindFullKey = function (_slot) {
        if (!_slot && _slot.bind) {
            console.log('slot bind is null');
            return '';
        }
        var key = '';
        if (_slot.parent && _slot.parent.bind) {
            key = this.slotBindFullKey(_slot.parent) + '.' + key;
        }
        else {
            key = _slot.bind;
        }
        return key;
    };
    oxerElement.prototype.getSlotBindValue = function (key) {
        var dataKeyStack = key.split('.').reverse();
        var targetProp = this.option.data;
        while (dataKeyStack.length > 0) {
            var _key = dataKeyStack.pop();
            targetProp = targetProp[_key];
        }
        return targetProp;
    };
    oxerElement.prototype.setSlotBindValue = function (key, value) {
        var dataKeyStack = key.split('.').reverse();
        var targetProp = this.option.data;
        while (dataKeyStack.length > 0) {
            var _key = dataKeyStack.pop();
            if (dataKeyStack.length > 0)
                targetProp = targetProp[_key];
            else
                targetProp[_key] = value;
        }
        return targetProp;
    };
    return oxerElement;
}());
var oxerOption = (function () {
    function oxerOption(option) {
        var _this = this;
        for (var key in option) {
            if (option.hasOwnProperty(key)) {
                _this[key] = option[key];
            }
        }
        if (!option.watchTable) {
            this.watchTable = [];
        }
        else {
            this.watchTable = option.watchTable;
        }
    }
    return oxerOption;
}());
var oxerSlot = (function () {
    function oxerSlot() {
    }
    return oxerSlot;
}());
var box = function (tagName, slot) { return oxerElement.createInstance(tagName, slot).createElement(); };
function Div(_slot) {
    if (!_slot) {
        _slot = new oxerSlot();
    }
    _slot.bindProcessor = function (ele, value) {
        ele.innerText = value;
    };
    return box('div', _slot);
}
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
