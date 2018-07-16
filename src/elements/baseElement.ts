var box = (tagName: string, slot?: oxerSlot, callback?: any) => {
    var oxEle = oxerElement.createInstance(tagName, slot);
    if (callback) {
        callback(oxEle)
    }
    return oxEle.createElement();
}

function Div(_slot?: oxerSlot) {
    if (!_slot) {
        _slot = new oxerSlot()
    }
    if (!_slot.bindProcessor) {
        _slot.bindProcessor = (ele, value) => {
            ele.innerText = value;
        }
    }
    return box('div', _slot);
}
function Span(_slot?: oxerSlot) {
    if (!_slot) {
        _slot = new oxerSlot()
    }
    if (!_slot.bindProcessor) {
        _slot.bindProcessor = (ele, value) => {
            ele.innerText = value;
        }
    }
    return box('span', _slot);
}
function Input(_slot?: oxerSlot) {
    if (!_slot) {
        _slot = new oxerSlot()
    }
    if (!_slot.bindProcessor) {
        _slot.bindProcessor = (ele, value) => {
            ele.value = value;
        }
    }
    if (!_slot.event) {
        _slot.event = {}
    }
    if (_slot.bind) {

    }
    _slot.event['input'] = function (event) {
        this.name = event.target.value;
    }
    return box('input', _slot, _oxEle => {
        var oxEle: oxerElement
        oxEle = _oxEle
        // if (_slot.bind)
        //     _slot.event['input'] = function (event) {
        //         oxEle.setSlotBindValue(_slot.bind, event.target.value)
        //     }
    });
}