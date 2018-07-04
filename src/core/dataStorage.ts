class dataStorage {
    context: context;
    constructor(_context: context) {
        this.context = _context;
    }

    public dataProcess() {
        var data = this.context.data;
        if (data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var element = data[key];
                    if (typeof element == 'object' && !(element instanceof Array)) {
                        // __processRootProp__(element, contextName && (contextName + '.' + key) || key, context)
                        continue;
                    } else {
                        //__setPropWatcher__(obj, key, contextName && (contextName + '.' + key) || key, context.watcherKeyVault);
                    }
                }
            }
        }
    }
}