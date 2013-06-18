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
            this.registerService(NewsService);
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
            
            this.YqlService.getModel({
                    q: "select * from html where url=\"http://finance.yahoo.com/q?s=" + searchTerm + "\" and xpath='//div[@id=\"yfi_headlines\"]/div[2]/ul/li/a' limit 5"
                },
                {
                    load: function (data) {
                        var results = (data.query && data.query.results) ? data.query.results.a : [],
                            i = 0,
                            resultContent = '',
                            currResult,
                            srcUrl,
                            name,
                            content;

                        if (!results.length) {
                            resultContent += "<div class='smithyGadget'>No results found for " + searchTerm + "</div>";
                        } else {
                            for (i; i < results.length; i += 1) {
                                currResult = results[i];
                                srcUrl = currResult.href;
                                name = srcUrl.match(/\*.*\/\/(.*?)\//i);
                                name = name && name.length === 2 ? name[1] : 'Source';
                                content = currResult.content;
                                resultContent += "<div class='smithyGadget'>";
                                resultContent += srcUrl ? "<a href='" + srcUrl + "' title='link to " +
                                    srcUrl + "' target='_blank'>" + name + " - </a>" : '';
                                resultContent += content;
                                resultContent += "</div>";
                            }
                        }
                        domConst.place(resultContent, container);
                        _this.showPlaceHolder(false);
                        _this.gadgetSpace.resize();
                    },
                        error: function (err) {
                        var err = "<div class='smithyGadget'>There was an error on a jsonpRequest: " + err.message + "</div>";
                        domConst.place(err, container);
                        _this.showPlaceHolder(false);
                    }
                }
            );
        }
    });
    return NewsGadget;
});