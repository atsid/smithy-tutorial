setupMessaging: function() {
    var that = this;
    this.registerSubscriber("channelName", function (msg) {
        if (msg.prop) {
            // perform some action
        }
    });
    this.registerPublisher("anotherChannel");
},

laterMethod: function () {
    this.pub.anotherChannel({message: "text"});
}
