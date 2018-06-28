class orxerData extends Object {
    public process() {
        if (this) {
            for (const key in this) {
                if (this.hasOwnProperty(key)) {
                    const element = this[key];
                    if (typeof element == 'object' && !(element instanceof Array)) {
                        //__processRootProp__(element, contextName && (contextName + '.' + key) || key, context)
                        continue;
                    } else {
                        //  __setPropWatcher__(obj, key, contextName && (contextName + '.' + key) || key, context.watcherKeyVault);
                    }
                }
            }
        }
    }

    private setWatcher() {

    }
}