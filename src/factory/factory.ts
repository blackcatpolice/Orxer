class factory implements dataFactory {
    context: orxerContext;
    constructor(_context: orxerContext) {
        this.context = _context;
        this.context.debug && (window['oxercontext'] = this.context)
        //this.context.data && this.processOxerData(this.context.data)
        // this.context.nodes &&  
    }

    public processOxerData(data: orxerData) {
        //this.processOxerData(this.context.data)
    }
}

// function factory (_context){
//     Object.keys(_context).forEach(objItme=>{
//         __processProperty__(objItme.toLocaleLowerCase(),_context[objItme],_context);
//     });
// } 

// function __processProperty__(name, value, context) {
//     switch (name) {
//         case 'debug':
//             value && (window['oxercontext'] = context);
//             break;
//         case 'nodes':
//             value && nodesFactory(value, context);
//             break;
//         case 'data':
//             value && pipline_data(value, context);
//             break;
//         default:
//             break;
//     }
// }