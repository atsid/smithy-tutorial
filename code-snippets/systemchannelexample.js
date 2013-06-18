setupMessaging: function() {
    var that = this;
    this.registerSubscriber("channelName", function (msg) {
        if (msg.prop) {
            // perform some action
        }
    });
    this.registerPublisher("anotherChannel");
    this.registerFrameworkSubscriber("GadgetSpaceStatusChange", function (msg) {
        if (msg.status === "RENDERED") {
            // perform some action
        }
    });
},

laterMethod: function () {
    this.pub.anotherChannel({message: "text"});
}
