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
        defaultValue: "TSLA",
        
        constructor: function (config) {
            var initData = (config && config.initData) || {};
            
            this.ApplicationTitle = initData.applicationTitle || "Search";
            this.style = initData.style;
        },
        
        setupMessaging: function () {
            var cfact = this.channelFactory,
                gadgetStatusChannel;
                
            this.searchUpdateChannel = cfact.get("SearchUpdate", this);
            
            //subscribe to gadget change messages on the framework channel
            this.registerFrameworkSubscriber("GadgetSpaceStatusChange", this.gadgetSpaceStatusChange);
        },
        
        /**
         * Set up search form
         */
        setupView: function () {
            var containerNode, refreshBtn, gadgetSearchNode;
            
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
                type: "button",
                tabindex: 1,
                onClick: lang.hitch(this, this.publishSearch)
            }).placeAt(gadgetSearchNode).focus();
        },
        
        publishSearch: function () {
            this.searchUpdateChannel.publish({searchTerm: this.searchBox.get("value")});
        },
        
        /**
         * Checks to see if the gadget space has rendered and invokes the search
         */
        gadgetSpaceStatusChange: function (message) {
            if (message.status === 'RENDERED') {
                this.publishSearch();
            }
        }
    });
    return SearchGadget;
});