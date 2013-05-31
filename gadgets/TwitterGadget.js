define([
    "smithy/declare",
    "./BaseDemoGadget",
    "dojo/io/script",
    "dojo/dom-construct"
], function (
    declare,
    BaseDemoGadget,
    ioScript,
    domConst
) {

    /**
     * A simple twitter feed gadget..
     * @class TwitterGadget
     */

    var TwitterGadget = declare("TwitterGadget", [BaseDemoGadget], {

        name: "TwitterGadget",
        title: "Twitter",
        
        setupView: function () {
            this.inherited(arguments);
            var gadgetContainer = domConst.create("div", {"class": "well gadgetFeedContainer"}, this.domNode);
            this.container = domConst.create("div", {"class": "gadgetFeed"}, gadgetContainer);
            this.placeHolder = domConst.create("p", {innerHTML: "Requesting data...", style: "display: none"}, gadgetContainer);
        },
        
        updateSearch: function (message) {
            var _this = this,
                searchTerm = message.searchTerm,
                container = this.container;
           
            domConst.empty(container);
            this.showPlaceHolder(true);
        
            ioScript.get({
                url: "http://search.twitter.com/search.json",
                callbackParamName: "callback",
                content: {
                    q: searchTerm,
                },
                load: function (data) {
                    // Set the data from the search into the viewbox in nicely formatted JSON
                    var results = data.results,
                        i = 0,
                        resultContent = '',
                        currResult,
                        from;
                        
                    if (!results.length) {
                        resultContent += "<div class='smithyGadget'>No results found for " + searchTerm + "</div>";
                    } else {
                        for (i; i < results.length; i += 1) {
                            currResult = results[i];
                            from = currResult.from_user;
                            date = new Date(currResult.created_at);
                            
                            resultContent += "<div class='tweet'><div class='image'>";
                            resultContent += "<a href='http://twitter.com/" + from + "'>";
                            resultContent += "<img src='" + currResult.profile_image_url + "' /></a></div>";
                            resultContent += "<p>" + currResult.text + "</p>";
                            resultContent += "<a class='date' href='http://twitter.com/" + from + "/statuses/" + currResult.id_str + "'>" + date + "</a>";
                            resultContent += "</div>";
                        }
                    }
                    domConst.place(resultContent, container);
                    _this.showPlaceHolder(false);
                },
                error: function (error) {
                    domConst.place("<p>There was a problem accessing Twitter: " + error + "</p>", container);
                    _this.showPlaceHolder(false);
                }
            });
        }
    });
    return TwitterGadget;
});