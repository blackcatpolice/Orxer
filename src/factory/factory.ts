class factory {
    context: orxerContext;
    constructor(_context: orxerContext) {
        this.context = _context;
        this.context.debug && (window['oxercontext'] = this.context)
        this.context.data && this.context.data.process()
        this.context.nodes&& this.context.nodes.process()
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