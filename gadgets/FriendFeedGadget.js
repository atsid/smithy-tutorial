define([
    "smithy/declare",
    "./BaseDemoGadget",
    "circuits/ServiceFactory",
    "amd-plugins/jsonschema!application/schema/services/FriendFeedService",
    "dojo/dom-construct"
], function (
    declare,
    BaseDemoGadget,
    ServiceFactory,
    FriendFeedService,
    domConst
) {

    /**
     * A simple FriendFeed gadget..
     * @class FriendFeedGadget
     */

    var FriendFeedGadget = declare("FriendFeedGadget", [BaseDemoGadget], {

        name: "FriendFeedGadget",
        title: "FriendFeed",
        
        constructor: function () {
            this.service = new ServiceFactory().getService(FriendFeedService);
        },
        
        setupView: function () {
            this.inherited(arguments);
            var gadgetContainer = domConst.create("div", {"class": "well gadgetFeedContainer friend"}, this.domNode);
            this.container = domConst.create("div", {"class": "gadgetFeed"}, gadgetContainer);
            this.placeHolder = domConst.create("p", {innerHTML: "Requesting data...", style: "display: none"}, gadgetContainer);
        },
        
        updateSearch: function (message) {
            var _this = this,
                searchTerm = message.searchTerm,
                container = this.container;
           
            domConst.empty(container);
            this.showPlaceHolder(true);
            
            this.service.getModel({
                q: searchTerm,
                callback: function (data) {
                    var results = data.entries,
                        i = 0,
                        resultContent = '',
                        currResult,
                        from;
                        
                    if (!results.length) {
                        resultContent += "<div class='smithyGadget'>No results found for " + searchTerm + "</div>";
                    } else {
                        for (i; i < results.length; i += 1) {
                            currResult = results[i];
                            imageUrl = currResult.thumbnails && currResult.thumbnails.length ? currResult.thumbnails[0].url : '';
                            date = new Date(currResult.date).toString();
                            
                            resultContent += "<div class='tweet'><div class='image'>";
                            resultContent += "<a href='" + currResult.url + "'>";
                            resultContent += "<img src='" + imageUrl + "' /></a></div>";
                            resultContent += "<p>" + currResult.body + "</p>";
                            resultContent += "<div>" + date.substring(0, 24) + "</div><div>" + currResult.from.name + "</div>";
                            resultContent += "</div>";
                        }
                    }
                    domConst.place(resultContent, container);
                    _this.showPlaceHolder(false);
                }
            });
        }
    });
    return FriendFeedGadget;
});