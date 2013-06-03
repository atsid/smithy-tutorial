define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dojo/dom-construct",
    "dojo/_base/lang"
], function (
    declare,
    Gadget,
    ContentPane,
    Button,
    TextBox,
    domConst,
    lang
) {

    /**
     * A simple search gadget.
     * @class SearchGadget
     */

    var SearchGadget = declare("SearchGadget", [ContentPane, Gadget], {
    
        name: "SearchGadget",
        title: "Search",
        defaultValue: "AMZN",
        
        constructor: function (config) {
            this.ApplicationTitle = (config && config.initData && config.initData.applicationTitle) ||
                "Search";
            this.style = config.initData.style;
        },
        
        setupMessaging: function () {
            var cfact = this.channelFactory;
            this.searchUpdateChannel = cfact.get("SearchUpdate", this);
        },
        
        /**
         * Set up search form
         */
        setupView: function () {
            var containerNode, refreshButton, gadgetSearchNode;
            
            this.inherited(arguments);
            this.set("content", "<h2 class='gadgetFeedHeader'>" + this.ApplicationTitle + "</h2>");
            
            gadgetSearchNode = domConst.create("div", {"class": "gadgetSearch"}, this.domNode);
            this.searchBox = new TextBox({
                label: "Search Term",
                placeHolder: "Search",
                value: this.defaultValue,
                style: "padding: 0em 1em;"
            }).placeAt(gadgetSearchNode);

            refreshBtn = new Button({
                label: "Search",
                onClick: lang.hitch(this, this.publishSearch)
            }).placeAt(gadgetSearchNode);
        },
        
        publishSearch: function () {
            this.searchUpdateChannel.publish({searchTerm: this.searchBox.get("value")});
        }
    });
    return SearchGadget;
});