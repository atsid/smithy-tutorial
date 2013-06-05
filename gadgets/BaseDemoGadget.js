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
            var initData = (config && config.initData) || {};
            this.ApplicationTitle = initData.applicationTitle || "Demo Gadget";
            this.style = initData.style;
            this.splitter = true;
        },
        
        setupView: function () {
            this.inherited(arguments);
            this.set("content", "<h2 class='gadgetFeedHeader'>" + this.ApplicationTitle + "</h2>");
        },

        setupMessaging: function () {
            var cfact = this.channelFactory;
            this.searchUpdateChannel = cfact.get("SearchUpdate", this);
            this.searchUpdateChannel.subscribe(this.updateSearch);
        },
        
        updateSearch: function (message) {},

        /**
         * Utility method for showing/hiding loading text.
         * @param {boolean} show true if loading text should be displayed
         */
        showPlaceHolder: function (show) {
            this.placeHolder.style.display = show ? "block" : "none";
        },
    });
    return BaseDemoGadget;
});
