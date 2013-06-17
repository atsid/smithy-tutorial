// Use AMD to define and load the resources we depend on.
require([
    "circuits/ServiceFactory",
    "circuits/plugins/HandlerPlugin",
    "schema/ExampleService",
    "schema/ExampleModel"
], function (
    ServiceFactory,
    HandlerPlugin,
    ExampleService,
    ExampleModel
    ) {
    // Create a service factory.
    var sfact = new ServiceFactory({
            // "resolver" is used by the factory to find schemas based on names.
            // resolve schema by mapping it to the dependency where it was already loaded.
            resolver: function (name) {
                if (name === "schema/ExampleSchema") {
                    return ExampleService;
                } else if (name === "schema/ExampleModel") {
                    return ExampleModel;
                }
            }
        }),
        msg = document.getElementsByName("ReturnedValue")[0],
        btn = document.getElementsByName("CallService")[0],

    // Get a service based on the SMD.
        service = sfact.getServiceByName("schema/ExampleSchema");

    // Call service and handle returned data.
    btn.onclick = function (evt) {
        service.getModel({file: "ExampleModelJson"}, {
            success: function (data, params) {
                msg.value = JSON.stringify(data);
            }
        });
    }

});
