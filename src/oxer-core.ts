function Oxer(option: oxerOption) {
    for (var key in option) {
        if (option.hasOwnProperty(key)) {
            var item = option[key];
            switch (key) {
                case 'data':

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

    function processNodes(nodes) {
        let elementArr: Array<oxerElement>;
        switch (typeof nodes) {
            case 'string':
                var _ele = document.createElement("span");
                _ele.innerText = nodes;
                document.body.appendChild(_ele);
                break;
            case typeof oxerElement:
                document.body.appendChild(nodes())
                break;
            case typeof elementArr:
                nodes.forEach(nodeItem => {
                    document.body.appendChild(nodeItem())
                });
                break;
            default:
                break;
        }
    }


}