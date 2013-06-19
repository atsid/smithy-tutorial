define([
    "../declare",
    "../Plugin"
], function (
    declare,
    Plugin
    ) {
    var module =  declare(Plugin, {

        constructor: function (args) {
            this.pointcut = "modelService.*",
            this.type = "mixin";
            this.fn = function (service, pertinentMethods) {
                service.create = service.postModel;
                service.read = service.getModel;
                service.update = service.putModel;
                service.remove = service.deleteModel;
            };
        }
    });

    return module;
});