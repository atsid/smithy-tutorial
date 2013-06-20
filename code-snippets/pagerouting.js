require([
    "smithy/AmdResolver",
    "smithy/PageRoutingGadgetSpace",
    "smithy/dojoviews/DojoViewFactory",
    "smithy/GadgetFactory",
    "bullhorn/ChannelFactory",
    "schematic/ModelFactory"
], function (
    AmdResolver,
    GadgetSpace,
    DojoViewFactory,
    GadgetFactory,
    ChannelFactory,
    ModelFactory
    ) {
    var vfact, gfact, cfact, mfact, layoudata, app, routingSpec;

    // ++
    // setup factories
    // ++

    // A specification mapping url patterns to
    // layouts.
    routingSpec = {
        // the application path all route urls
        // are relative to.
        rootPattern: /^.*PageRoutingExample\/?/,
        routes: {
            "default": {
                id: "application/data/default",
                url: ""
            },
            "error": {
                id: "application/data/error"
            },
            "TitleGadget": {
                id: "application/data/titlegadget",
                url: "titlegadget/{applicationTitle}"
            },
            "NavigationGadget": {
                id: "application/data/navigationgadget",
                url: "navigationgadget"
            },
            "WidgetTestGadget": {
                id: "application/data/widgettestgadget",
                url: "widgettestgadget"
            }
        }
    };

    // instantiate gadget space
    app = new GadgetSpace({
        gadgetFactory: gfact,
        viewFactory: vfact,
        channelFactory: cfact,
        modelFactory: mfact,
        usePageRouting: "url",
        routingSpecification: routingSpec,
        extendedWindowConfig: {
            url: "ExtendedWindow.html"
        },
        useWebStorageForSlag: true
    });

    app.realizeLayout();

});
