//程序主入口
function Oxer(_option: oxerOption | any) {
    var option = new oxerOption(_option);

    for (var key in option) {
        if (option.hasOwnProperty(key)) {
            var item = option[key];
            switch (key) {
                case 'data':
                    processData(item)
                    break;
                case 'enableDebug':
                    break;
                case 'enableRoute':
                    break;
                case 'nodes':
                    processNodes(item)
                    break;
                default:
                    break;
            }
        }
    }
    //处理主入口传入的data 属性
    /* Process Data */
    function processData(data) {
        __loopProperty__(data);
    }

    function __loopProperty__(data, dataName?: string) {
        if (!data) {
            console.warn('data is null')
            return;
        }

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var dataItem = data[key];
                var fullKeyName = dataName && (dataName + '.' + key) || key;
                if (typeof dataItem == 'object' && !(dataItem instanceof Array)) {
                    __loopProperty__(dataItem, fullKeyName)
                } else {
                    __setPropertyWatcher__(data, key, fullKeyName)
                }
            }
        }
    }

    function __setPropertyWatcher__(obj, key, fullKeyName) {
        var tmpValue = obj[key];
        Object.defineProperty(obj, key, {
            get: () => {
                return this[key]
            },
            set: val => {
                this[key] = val;
                if (option.watchTable[fullKeyName]) {
                    option.watchTable[fullKeyName].forEach(watchItem => {
                        watchItem.func(watchItem.ele, val)
                    });
                }
            },
            enumerable: true,
            configurable: true
        })
        obj[key] = tmpValue;
    }
    /*End Process Data */

    //处理主入口传入的nodes 属性
    /** Process Nodes */
    function processNodes(nodes) {
        switch (true) {
            case typeof nodes == 'string':
                var _ele = document.createElement("span");
                _ele.innerText = nodes;
                document.body.appendChild(_ele);
                break;
            case !Array.isArray(nodes):
                document.body.appendChild(nodes(option))
                break;
            case Array.isArray(nodes):
                nodes.forEach(nodeItem => {
                    document.body.appendChild(nodeItem(option))
                });
                break;
            default:
                break;
        }
    }
    /**End Process Nodes */    
}