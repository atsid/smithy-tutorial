define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/layout/ContentPane",
    "dojo/dom-construct"
], function (
    declare,
    Gadget,
    ContentPane,
    domConst
) {

    /**
     * A base demo gadget.
     * @class BaseDemoGadget
     */

    var BaseDemoGadget = declare("BaseDemoGadget", [ContentPane, Gadget], {

        name: "DemoGadget",
        title: "Demo",
        
        constructor: function (config) {
            this.ApplicationTitle = (config && config.initData && config.initData.applicationTitle) ||
                "Demo Feed";
            this.style = config.initData.style;
            this.splitter = true;
        },
        
        setupView: function () {
            //var gadgetContainer = domConst.create("div", {"class": "well gadgetFeedContainer"}, this.domNode);
            this.set("content", "<h2 class='gadgetFeedHeader'>" + this.ApplicationTitle + "</h2>");
            //this.container = domConst.create("div", {"class": "gadgetFeed"}, gadgetContainer);
            //this.placeHolder = domConst.create("p", {innerHTML: "Requesting data...", style: "display: none"}, this.container);
        },
        
        /**
         * Utility method for showing/hiding loading text.
         * @param {boolean} show true if loading text should be displayed
         */
        showPlaceHolder: function (show) {
            this.placeHolder.style.display = show ? "block" : "none";
        },

        setupMessaging: function () {
            var cfact = this.channelFactory;
            this.searchUpdateChannel = cfact.get("SearchUpdate", this);
            this.searchUpdateChannel.subscribe(this.updateSearch);
        },

        updateSearch: function (message) {}
    });
    return BaseDemoGadget;
});
