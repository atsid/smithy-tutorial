// The Gadget factory used by smithy to load gadgets.
gfact = new GadgetFactory({
    resolver: new AmdResolver({
        path: "application/gadgets/",
        synchronous: true
    }).resolver
});

// A view factory to create views that support smithy's hierarchy of
// of GadgetAreas and layout methods.
vfact = new DojoViewFactory({root: 'gadgetSpace'});

// The ChannelFactory used by bullhorn to find and create
// message channels.
cfact = new ChannelFactory({
    resolver: new AmdResolver({
        path: "application/schema/channels/",
        synchronous: true
    }).resolver
});

// The model factory used by schematic to find
// and create models from jsonschema definitions.
mfact = new ModelFactory({
    resolver: new AmdResolver({
        path: "application/schema/models/",
        synchronous: true
    }).resolver
});

// The service factory used by circuits to find
// and create services from smd's.
sfact = new ServiceFactory({
    resolver: function (name) {
        var ret, modr = new AmdResolver({
            path: "schema/models/",
            synchronous: true
        }), svcr = new AmdResolver({
            path: "schema/services/",
            synchronous: true
        });
        if (name.indexOf("models") != -1) {
            ret = modr.resolver(name);
        } else {
            ret = svcr.resolver(name);
        }
        return ret;
    }
});

// All passed to the GadgetSpace so they
// are available to smithy and gadgets it creates.
//
// This configuration also includes instructions for other
// facilities on that gadget space, such as whether nor not
// to load gadgets synchronously, configuration for extended
// windows and whether or not web storage should be used for
// application-wide data called Slag.
application = new GadgetSpace({
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
