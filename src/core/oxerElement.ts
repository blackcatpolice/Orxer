class oxerElement {
    private constructor(tagName: string, slot: oxerSlot) {
        this.slot = slot;
        this.tagName = tagName;
    }

    private tagName: string;
    private option: oxerOption;
    public slot: oxerSlot;

    public static createInstance(tagName: string, slot?: oxerSlot): oxerElement {
        return new oxerElement(tagName, slot);
    }

    public createElement() {
        return (option: oxerOption) => {
            this.option = option;
            var _ele = document.createElement(this.tagName)
            this.processSlot(_ele)
            return _ele
        };
    }

    private processSlot(element: HTMLElement) {
        Object.keys(this.slot).forEach(slotItemKey => {
            var slotItem = this.slot[slotItemKey]
            switch (slotItemKey) {
                case 'event':
                    break;
                case 'data':
                    break;
                case 'class':
                    break;
                case 'bind':
                    this.slotBind(element)
                    break;
                case 'nodes':
                    break;
                default:
                    break;
            }
        })
    }

    //对绑定的data对象进行渲染, 渲染方式由bindProcessor提供
    private slotBind(element: HTMLElement) {
        var key = this.slotBindFullKey(this.slot);
        //渲染初始化的值
        var currentValue = this.getSlotBindValue(key)
        this.processBindProcessor(element, currentValue)
        //进行data 模型绑定
        if (!this.option.watchTable[key]) {
            this.option.watchTable[key] = []
        }
        this.option.watchTable[key].push({
            ele: element,
            func: this.processBindProcessor
        })
    }

    //处理模型帮顶器
    private processBindProcessor(element, value) {
        if (this.slot.bindProcessor) {
            if (this.slot.bindProcessor instanceof Array) {
                this.slot.bindProcessor.forEach(_processor => {
                    _processor(element, value)
                });
            } else {
                this.slot.bindProcessor(element, value)
            }
        }
    }

    private slotBindFullKey(_slot: oxerSlot): string {
        if (!_slot && _slot.bind) {
            console.log('slot bind is null')
            return '';
        }

        var key = ''

        if (_slot.parent && _slot.parent.bind) {
            key = this.slotBindFullKey(_slot.parent) + '.' + key
        }
        else {
            key = _slot.bind
        }

        return key;
    }
    //取出上下文中对象的值
    private getSlotBindValue(key) {
        var dataKeyStack = key.split('.').reverse();
        var targetProp = this.option.data;
        while (dataKeyStack.length > 0) {
            var _key = dataKeyStack.pop();
            targetProp = targetProp[_key]
        }
        return targetProp;
    }

    //设置上下文中对象的值
    private setSlotBindValue(key, value) {
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
    }
}