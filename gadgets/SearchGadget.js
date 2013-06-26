define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dojo/dom-construct",
    "dojo/keys",
    "dojo/on",
    "dojo/_base/lang"
], function (
    declare,
    Gadget,
    ContentPane,
    Button,
    TextBox,
    domConst,
    keys,
    on,
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
            this.registerPublisher("SearchUpdate");
            
            //subscribe to gadget change messages on the framework channel
            this.registerFrameworkSubscriber("GadgetSpaceStatusChange", this.gadgetSpaceStatusChange);
        },
        
        /**
         * Set up search form
         */
        setupView: function () {
            var containerNode, 
                gadgetSearchNode,
                seachBox,
                _this = this;
            
            this.inherited(arguments);
            this.set("content", "<h2 class='gadgetFeedHeader'>" + this.ApplicationTitle + "</h2>");
            
            gadgetSearchNode = domConst.create("div", {"class": "gadgetSearch"}, this.domNode);
            this.searchBox = searchBox = new TextBox({
                label: "Search Term",
                placeHolder: "Search",
                value: this.defaultValue,
                selectOnClick: true,
                style: "padding: 0em 1em;"
            }).placeAt(gadgetSearchNode)
            searchBox.on("keyPress", function (e) {
                if (e.keyCode === keys.ENTER) {
                    _this.publishSearch();
                }
            });

            new Button({
                label: "Search",
                type: "submit",
                onClick: lang.hitch(this, this.publishSearch)
            }).placeAt(gadgetSearchNode);
        },
        
        publishSearch: function () {
            this.pub.SearchUpdate({searchTerm: this.searchBox.get("value")});
            this.searchBox.focus();
            this.searchBox.focusNode.select();
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