define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/layout/ContentPane",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/json",
    "dojo/io/script",
    "dojo/_base/lang"
], function (
    declare,
    Gadget,
    Button,
    TextBox,
    ContentPane,
    domConst,
    dom,
    JSON,
    ioScript,
    lang
) {

    /**
     * A simple twitter feed gadget to demo a dojo gadget.
     * @class TwitterGadget
     * A simple TwitterGadget gadget
     */

    return declare("BaseDemoGadget", [ContentPane, Gadget], {

        constructor: function (config) {
            this.ApplicationTitle = (config && config.initData && config.initData.applicationTitle) ||
                "Demo Feed";
            this.style = config.initData.style;
        },

        name: "DemoGadget",
        title: "Demo",
        searchLabel: "Get",
        searchPlaceHolder: "Enter search",

        setupMessaging: function () {
            var cfact = this.channelFactory;
            this.searchUpdateChannel = cfact.get("SearchUpdate", this);
            this.searchUpdateChannel.subscribe(this.updateSearch);
        },


        /**
         * Set up form
         */
        setupView: function () {
            var refreshBtn, searchBox, containerNode, gadgetSearchNode, searchLabel = this.searchLabel,
                placeHolderText = this.searchPlaceHolder;
            this.inherited(arguments);
            this.set("content", "<h2 class='gadgetFeedHeader'>" + this.ApplicationTitle + "</h2>");


            containerNode = domConst.create("div", {"class": "gadgetFeedContainer"}, this.domNode);

            gadgetSearchNode = domConst.create("div", {"class": "gadgetSearch"}, containerNode);

            this.searchBox = new TextBox({
                label: "Search Term",
                placeHolder: placeHolderText,
                style: "padding: 0em 1em;"
            }).placeAt(gadgetSearchNode);

            refreshBtn = new Button({
                label: searchLabel,
                onClick: lang.hitch(this, this.getFeed)
            });
            refreshBtn.placeAt(gadgetSearchNode);

            this.gadgetContainerNode = domConst.create("div", {"class": "gadgetFeed"}, containerNode);
            this.placeHolder = domConst.create("p", {innerHTML: "Requesting data...", style: "display: none"}, containerNode);


        },

        updateSearch: function (message) {
            this.searchBox.set("value", message.searchTerm);
            this.getFeed(null, true);
        },

        /**
         * Utility method for showing/hiding loading text.
         * @param {boolean} show true if loading text should be displayed
         */
        showPlaceHolder: function (show) {
            this.placeHolder.style.display = show ? "block" : "none";

        },


        /**
         * Get's twitter feed using JSONP and loads the result on to the page.
         */
        getFeed: function (evt, stopMessage) {
            var _this = this, targetNode = _this.gadgetContainerNode, params, searchBox = _this.searchBox,
                searchTerm = searchBox.value || "AMZN";
            targetNode.innerHTML = ''; //clear old results

            _this.showPlaceHolder(true);

            // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
            params = this.getParams(_this, searchTerm, targetNode);
            ioScript.get(params);
            if (!stopMessage) {
                this.searchUpdateChannel.publish({searchTerm: searchTerm});
            }
        },

        getParams: function (scope, searchTerm, targetNode) {}
    });
});