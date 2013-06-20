// Use AMD to load dependencies, in this case the model factory and model schema.
require ([
    "schematic/ModelFactory",
    "jsonschema!models/ExampleModel"
], function (
    ModelFactory,
    ExampleModel
) {
    // Create a factory. Configure a resolver if you want to
    // create models by name.
    var factory = new ModelFactory({
        resolve: function (name) {
            return (name.indexOf("ExampleModel") > -1) ? ExampleModel : undefined;
        }
    });

    // A model can be created by name, in which case the
    // configured resolvers are used.
    var model = factory.getModel("models/ExampleModel");
    var model = factory.getModelByName("models/ExampleModel");

    // A model can be created by schema, if the schema is loaded.
    var model = factory.getModel(ExampleModel);
    var model = factory.getModelBySchema(ExampleModel);

    // It's possible to treat another object as an instance of a model
    // by passing it as the second argument. In this case
    // the created model is a surrogate that affects and protects
    // the underlying object.
    var underlyingObject = {aProp: "val1", anotherProp: "val2)"};
    var model = factory.getModel(ExampleModel, underlyingObject);

    // An initialized model can be created by schema or name
    // by passing an instance to initialize with.
    var model = factory.getModelInitialized("models/ExampleModel", {aProp: "val1", anotherProp: "val2)"});

    // Once a model is created, properties can be set
    // either naturally with assignment or using the set() method.
    model.aProp = "newValue";
    model.set("aProp", "newValue");

    // The properties of another object, or model can be copied
    // into this model.
    model.copyFrom({aProp: "val3", anotherProp: "val4)"});
    model.copyFrom(model2);

    // Because property getters and setters are over-ridden
    // JSON.stringify() works fine.
    var str = JSON.stringify(model);

    // A change handler can be set on a model property.
    model.onChange("aProp", function (oldValue, newValue) {
        uiElement.set("value", newValue);
    });
});

