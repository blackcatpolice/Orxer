class oxerElement {
    private constructor(tagName: string, slot: oxerSlot) {
        this.slot = slot;
        this.tagName = tagName;
    }

    private tagName: string;
    private option: oxerOption;
    public slot: oxerSlot;

    public static createInstance(tagName: string, slot?: oxerSlot): oxerElement {
        return new oxerElement(tagName, slot)
    };

    //oxer 页面渲染的核心方法, 即时调用, 延迟执行.
    public createElement() {
        return (option: oxerOption, parentSlot?: oxerSlot) => {
            this.option = option;
            var _ele = document.createElement(this.tagName)
            //建立slot 层级关系
            if (parentSlot) {
                if (!parentSlot.children) {
                    parentSlot.children = []
                }
                parentSlot.children.push(this.slot);
                this.slot.parent = parentSlot
            }
            this.processSlot(_ele)
            return _ele
        };
    }

    // 处理slot 的核心方法.
    private processSlot(element: HTMLElement) {
        Object.keys(this.slot).forEach(slotItemKey => {
            var slotItem = this.slot[slotItemKey]
            switch (slotItemKey) {
                case 'event':
                    this.slotEvent(element);
                    break;
                case 'data':
                    break;
                case 'class':
                    this.slotClass(element);
                    break;
                case 'bind':
                    this.slotBind(element)
                    break;
                case 'nodes':
                    this.slotNodes(element)
                    break;
                default:
                    break;
            }
        })
    }

    //对绑定的事件进行处理
    /**Process Slot Event */
    private slotEvent(element: HTMLElement) {
        if (!this.slot.event || Object.keys(this.slot.event).length == 0) {
            console.warn('slot event is null or empty')
            return;
        }
        for (var eventName in this.slot.event) {
            if (this.slot.event.hasOwnProperty(eventName)) {
                var eventItem = this.slot.event[eventName];
                if (!/on\w+/g.test(eventName)) {
                    eventName = 'on' + eventName;
                }

                element[eventName] = (event) => {
                    eventItem.call(this.option.data, event);
                }
            }
        }
    }
    /**End Process Slot Event */

    //对绑定的 class 进行处理
    /**Process Slot Class */
    private slotClass(element: HTMLElement) {
        if (!this.slot.class || this.slot.class.length == 0) {
            console.warn('slot class is empty or null')
            return;
        }
        this.slot.class.forEach(classItem => {
            element.classList.add(classItem)
        });
    }
    /**End Process Slot Class */

    //对绑传入元素的子元素进行处理
    /**Process Slot Nodes */
    private slotNodes(element: HTMLElement) {
        var nodes = this.slot.nodes;
        switch (true) {
            case typeof nodes == 'string':
                var _ele = document.createElement("span");
                _ele.innerText = nodes;
                element.appendChild(_ele);
                break;
            case !Array.isArray(nodes):
                element.appendChild(nodes(this.option))
                break;
            case Array.isArray(nodes):
                nodes.forEach(nodeItem => {
                    element.appendChild(nodeItem(this.option))
                });
                break;
            default:
                break;
        }
    }
    /**End Process Slot Nodes */

    //对绑定的data对象进行渲染, 渲染方式由bindProcessor提供
    /** Process Slot Bind */
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
            func: this.slot.bindProcessor
        })
    }

    //处理模型绑定器
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

    /**End Process Slot Bind */
}