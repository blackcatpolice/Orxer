class oxerOption {
    public enableRoute: boolean;
    public enablDebug: boolean;
    public data: Object;
    public nodes: Array<oxerElement> | string | oxerElement;
    public watchTable: any;
    public constructor(option) {
        var _this = this;
        for (var key in option) {
            if (option.hasOwnProperty(key)) {
                _this[key] = option[key];
            }
        }
        if (!option.watchTable) {
            this.watchTable = []
        }
        else {
            this.watchTable = option.watchTable;
        }
    }
}

