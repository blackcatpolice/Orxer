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
                    this.slotData();
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

    //处理slot 绑定data 对象
    /**Process Slot Data */
    private slotData() {
        //把slot中定义的变量导入
        if (this.slot.data)
            this.loopProperty(this.slot.data)

        //把全局变量导向到slot 变量
        for (var key in this.option) {
            if (this.option.hasOwnProperty(key)) {
                var item = this.option[key];
                if (!this.slot.data[key]) {
                    this.slot.data[key] = item;
                }
            }
        }
    }


    private loopProperty(data, dataName?: string) {
        if (!data) {
            console.warn('slot data is null')
            return;
        }

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var dataItem = data[key];
                var fullKeyName = dataName && (dataName + '.' + key) || key;
                if (typeof dataItem == 'object' && !(dataItem instanceof Array)) {
                    this.loopProperty(dataItem, fullKeyName)
                } else {
                    this.setPropertyWatcher(data, key, fullKeyName)
                }
            }
        }
    }

    private setPropertyWatcher(obj, key, fullKeyName) {
        var tmpValue = obj[key];
        Object.defineProperty(obj, key, {
            get: () => {
                return this[key]
            },
            set: val => {
                this[key] = val;
                if (!this.slot.watchTable) this.slot.watchTable = [];

                if (this.slot.watchTable[fullKeyName]) {
                    this.slot.watchTable[fullKeyName].forEach(watchItem => {
                        watchItem.func.call(this.slot.data, watchItem.ele, val)
                    });
                }
            },
            enumerable: true,
            configurable: true
        })
        obj[key] = tmpValue;
    }
    /**End Process Slot Data */


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
        var _this = this;
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
            func: function (ele, val) {
                //merge global data 
                var currentInstance = this;
                if (!this.slot.data) {
                    this.slot.data = {}
                }
                Object.keys(this).forEach(itemKey => {
                    if (!_this.slot.data[itemKey]) {
                        _this.slot.data[itemKey] = currentInstance[itemKey]
                    }
                })
                this.bindProcessor.call(_this.slot.data, ele, val)
            }
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
                this.slot.bindProcessor.call(this.slot.data, element, value)
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