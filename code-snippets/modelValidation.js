define([
    "schematic/plugins/SchemaValidationPlugin",
    "schematic/plugins/RegExpValidationPlugin",
    "schematic/plugins/LuhnValidationPlugin"
], function (
    SchemaValidationPlugin,
    RegExpValidationPlugin,
    LuhnValidationPlugin
    ) {
    return {
        addValidators: function (factory) {
            // Add a validator for JsonSchema defined meta-data.
            // The model pattern and property pattern determine what the validator
            // applies to (in this case all models and properties)
            // The "requiredMessage" attribute defines a message for "require" failures.
            factory.addValidator(new SchemaValidationPlugin({
                modelPattern: /.*/,
                propertyPattern: /.*/,
                requiredMessage: {code: 0, message: "Field is required"}}
            ));
            // Add a validator that tests for a regular expression match.
            // This validator applies only to the cardType on the CreditDebitCardPaymentMethod
            // model.
            factory.addValidator(new RegExpValidationPlugin({
                modelPattern: /CreditDebitCardPaymentMethod.*/,
                propertyPattern: /cardType/,
                pattern: /[VMAD]{1}/,
                message: {code: 0, message: "Card Type is Invalid"}}
            ));
            // Add a validator that tests for Luhn algorithm compliance.
            // This validator applies only to the cardNumber on the CreditDebitCardPaymentMethod
            // model.
            factory.addValidator(new LuhnValidationPlugin({
                modelPattern: /CreditDebitCardPaymentMethod.*/,
                propertyPattern: /cardNumber/,
                message: {code: 0, message: "Card Number is invalid."}}
            ));
        }
    };
});