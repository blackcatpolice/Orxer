class context {
    data: oxerdata;
    nodes: any;
    dataStorage: dataStorage;
    watcherTable: any;
    constructor() {
        this.dataStorage = new dataStorage(this);
    }

    public processor() {
        this.dataStorage.dataProcess();
    }


    public proccessRootNode() {
        if (this.nodes) {
            if (this.nodes instanceof Array) {
                this.nodes.forEach(item => {
                    item && document.body.appendChild(item());
                });
            }
        }
    }

    /**
     * processProp 
     * 进行双向绑定, 先遍历data 层级, 罗列每一级的变量名
     */
    public processProp(dataObject, dataPropName) {
        var data = this.data;
        if (data) {
            for (var propName in data) {
                if (data.hasOwnProperty(propName)) {
                    var curObj = data[propName];
                    //若有上级名称, 则使用dataPropName 否则则使用 当前字段名称
                    var dataFullKey = dataPropName && (dataPropName + '.' + propName) || propName;
                    if (typeof curObj == 'object' && !(curObj instanceof Array)) {
                        //如果当前是对象或数组则继续遍历, 否则则添加watcher
                        this.processProp(dataObject, dataFullKey)
                        continue;
                    } else {
                        this.watcher(dataObject, propName, dataFullKey)
                    }
                }
            }
        }
    }

    /**
     * getFullKey
     */
    public getFullKey(option) {
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
    }

    private watcher(dataObj, dataKey, dataFullKey) {
        var contextPointer = this;
        Object.defineProperty(dataObj, dataKey, {
            get: function () {
                return this[dataKey];
            },
            set: function (val) {
                this[dataKey] = val;
                contextPointer.watcherTable && contextPointer.watcherTable.forEach(item => {
                    item.func(item.el, val)
                });
            },
            enumerable: true,
            configurable: true
        })
    }

    private processNodes(element: any) {
        var nodes = this.nodes;
        if (nodes instanceof oxernodes) {
            nodes.forEach(item => {
                if (typeof item == 'string') {
                    element.appendChild(item);
                }
                else {
                    item && element.appendChild(item());
                }
            })
        }
    }

    private createElement() {
        return () => {

        }
    }
}