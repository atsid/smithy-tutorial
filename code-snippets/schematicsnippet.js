// Use AMD to define and load the resources we depend on.
require([
    "schematic/ModelFactory",
    "schema/ExampleSchema"
], function (
    ModelFactory,
    ExampleSchema
    ) {
    // Create a model factory.
    var mfact = new ModelFactory({
            // "resolver" is used by the factory to find schemas based on names.
            // resolve schema by mapping it to the dependency where it was already loaded.
            resolver: function (name) {
                if (name === "schema/ExampleSchema") {
                    return ExampleSchema;
                }
            }
        }),
    // Create a model based on the Example schema.
        model = mfact.getModel("schema/ExampleSchema"),
        msg = document.getElementsByName("message")[0],
        btn = document.getElementsByName("Increment")[0];

    model.num = 1;
    // update the model.
    // Should fail after 10, because the schema defines a maximum of 10 for the num property.
    btn.onclick = function (evt) {
        model.num = model.num + 1;
        msg.innerHTML = "model.num equals " + model.num;
    }

});
