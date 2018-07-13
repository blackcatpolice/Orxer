var box = (tagName: string, slot?: oxerSlot) => oxerElement.createInstance(tagName, slot).createElement();

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

    _slot.event['keypress'] = function (event) {
        this.name = event.target.value;
    }
    return box('input', _slot);
}