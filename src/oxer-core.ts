function Oxer(option) {
    var context: any = {};
    context.extend({
        watcherKeyVault: {},
        elements: {}
    });
    context.extend(option);

    new factory(context)
} 