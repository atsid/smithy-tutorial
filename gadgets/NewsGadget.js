define([
    "smithy/declare",
    "./BaseDemoGadget",
    "circuits/ServiceFactory",
    "amd-plugins/jsonschema!application/schema/services/YqlService",
    "dojo/dom-construct"
], function (
    declare,
    BaseDemoGadget,
    ServiceFactory,
    NewsService,
    domConst
) {

    /**
     * A simple news feed gadget.
     * @class NewsGadget
     */

    var NewsGadget = declare("NewsGadget", [BaseDemoGadget], {

        name: "NewsGadget",
        title: "News",
        
        constructor: function () {
            this.service = new ServiceFactory().getService(NewsService);
        },
        
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
            
            this.service.getModel({
                q: "select * from html where url=\"http://finance.yahoo.com/q?s=" + searchTerm + "\" and xpath='//div[@id=\"yfi_headlines\"]/div[2]/ul/li/a' limit 5",
                callback: function (data) {
                    var results = (data.query && data.query.results) ? data.query.results.a : [], 
                        i = 0, 
                        resultContent = '', 
                        currResult, 
                        srcUrl, 
                        content;

                    if (!results.length) {
                        resultContent += "<div class='smithyGadget'>No results found for " + searchTerm + "</div>";
                    } else {
                        for (i; i < results.length; i += 1) {
                            currResult = results[i];
                            srcUrl = currResult.href;
                            content = currResult.content;
                            resultContent += "<div class='smithyGadget'>";
                            resultContent += srcUrl ? "<a href='" + srcUrl + "' title='link to " +
                                srcUrl + "' target='_blank'>source - </a>" : '';
                            resultContent += content;
                            resultContent += "</div>";
                        }
                    }
                    domConst.place(resultContent, container);
                    _this.showPlaceHolder(false);
                }
            });
        }
    });
    return NewsGadget;
});