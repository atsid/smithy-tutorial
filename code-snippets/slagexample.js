// Slag can be configured via the GadgetSpace
// configuration object. The useWebStorageForSlag
// can be set to "session" if you want slag to use
// session storage, any other truthy value to use local storage
// and unset or falsey to store slag data on the slag object itself.
gadgetSpace = new GadgetSpace({
    async: false,
    gadgetFactory: gfact,
    viewFactory: vfact,
    channelFactory: cfact,
    modelFactory: mfact,
    serviceFactory: sfact,
    extendedWindowConfig: {
        url: "ExtendedWindow.html"
    },
    useWebStorageForSlag: "session"
});

// GadgetSpace and GadgetArea contain methods for setting
// and getting slag values.
var val = gadgetSpace.getSlagData("name");
gadgetSpace.setSlagData("name", "value");

// The framework publishes a bullhorn message on a change
// to slag data.
this.registerFrameworkSubscriber("SlagChange", function (message) {
    this.messageArea.set(
        "value",
        "Path: '" +
            message.path +
            "' with old value: '" +
            JSON.stringify(message.oldValue) +
            "' and new value '" +
            JSON.stringify(message.newValue) +
            "'"
    );
});

