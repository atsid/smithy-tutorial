// Use AMD to define and load the resources we depend on.
require([
    "bullhorn/ChannelFactory",
    "schema/ExampleChannel"
], function (
    ChannelFactory,
    ExampleChannel
) {

    // Create a channel factory.
    var cfact = new ChannelFactory({
            // "resolver" is used by the factory to find schemas based on names.
            // resolve schema by mapping it to the dependency where it was already loaded.
            resolver: function (name) {
                if (name === "schema/ExampleChannel") {
                    return ExampleChannel;
                }
            }
        }),
        pub1 = {name: "publisher 1"},
        sub1 = {name: "subscriber 1"},
        sub2 = {name: "subscriber 2"},
    // The publishers and subscribers create channels from the same schema
    // passing themselves as the "scope".
        pub1Channel = cfact.get("schema/ExampleChannel", pub1),
        sub1Channel = cfact.get("schema/ExampleChannel", sub1),
        sub2Channel = cfact.get("schema/ExampleChannel", sub2);

    // Channels are "scoped" based on the second argument of the
    // factory's get method, so subscriber callbacks are called in
    // that scope.
    sub1Channel.subscribe(function (message) {
        console.log(message.text + this.name + " should be subscriber 1");
    });
    sub2Channel.subscribe(function (message) {
        console.log(message.text + this.name + " should be subscriber 2");
    });

    // publish a message on the channel, each receiver should get it.
    pubChannel.publish({ text: "hello, "});
});