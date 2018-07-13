var box = (tagName: string, slot?: oxerSlot) => oxerElement.createInstance(tagName, slot).createElement();

function Div(_slot?: oxerSlot) {
    if (!_slot) {
        _slot = new oxerSlot()
    }
    _slot.bindProcessor = (ele, value) => {
        ele.innerText = value;
    }
    return box('div', _slot);
    // var eleInstance = oxerElement.createInstance('div', _slot)
    // return eleInstance.createElement();
}