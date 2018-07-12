function Oxer(option) {
    if (option.data) {
    }
    if (option.enablDebug) {
    }
    if (option.enableRout) {
    }
    var elementArr;
    switch (typeof option.nodes) {
        case 'string':
            break;
        case typeof oxerElement:
            break;
        case typeof elementArr:
            break;
        default:
            break;
    }
}
var oxerElement = (function () {
    function oxerElement() {
    }
    oxerElement.createElement = function () {
        return new oxerElement();
    };
    return oxerElement;
}());
var oxerOption = (function () {
    function oxerOption() {
    }
    return oxerOption;
}());
var oxerSolot = (function () {
    function oxerSolot() {
    }
    return oxerSolot;
}());
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
