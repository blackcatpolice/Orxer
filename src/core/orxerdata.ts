class oxerdata extends Object {

    /**
     * getValue
     */
    public getValue(key) {
        var obj = this;
        if (obj && key) {
            var dataKeyStack = key.split('.').reverse();
            var targetProp = obj;
            while (dataKeyStack.length > 0) {
                var _key = dataKeyStack.pop();
                targetProp = targetProp[_key];
            }
            return targetProp;
        }
    }

    /**
     * setValue
     */
    public setValue(key, value) {
        var obj = this;
        if (obj && key) {
            var dataKeyStack = key.split('.').reverse();
            var targetProp = obj;
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
}