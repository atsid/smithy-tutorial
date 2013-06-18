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
    StockService,
    domConst
) {

    /**
     * A simple stock feed gadget.
     * @class StockGadget
     */

    var StockGadget = declare("StockGadget", [BaseDemoGadget], {

        name: "StockGadget",
        title: "Stock",
        
        constructor: function () {
        },

        setupServices: function () {
            this.registerService(StockService);
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
            
//            this.YqlSchema.getModel({
//                q: "select * from yahoo.finance.quotes where symbol = '" + searchTerm + "'",
//                callback: function (data) {
//                    var result = (data.query && data.query.results) ? data.query.results.quote : {},
//                    resultContent = '';
//
//                    if (!result.Ask) {
//                        resultContent += "<div class='smithyGadget'>No results found for " + searchTerm + "</div>";
//                    } else {
//                        resultContent += "<div class='smithyGadget'>";
//                        resultContent += "<div><span class='stockName'>" + result.Name + "</span> - (" + searchTerm + ")</div>";
//                        resultContent += "<div class='stockLeftDiv'>";
//                        resultContent += "Previous Close: " + result.PreviousClose + "<br />";
//                        resultContent += "Open: " + result.Open + "<br />";
//                        resultContent += "Bid: " + result.Bid + "<br />";
//                        resultContent += "Ask: " + result.Ask + "<br />";
//                        resultContent += "</div>";
//
//                        resultContent += "<div class='stockLeftDiv'>";
//                        resultContent += "Day's Range: " + result.DaysRange + "<br />";
//                        resultContent += "Year Range: " + result.YearRange + "<br />";
//                        resultContent += "Volume: " + result.Volume + "<br />";
//                        resultContent += "Average Volume: " + result.AverageDailyVolume + "<br />";
//                        resultContent += "</div>";
//                        resultContent += "</div>";
//                    }
//                    domConst.place(resultContent, container);
//                    _this.showPlaceHolder(false);
//                    _this.gadgetSpace.resize();
//                }
//            });
            this.YqlSchema.getModel({
                q: "select * from yahoo.finance.quotes where symbol = '" + searchTerm + "'",
                },
                {
                    load: function (data) {
                        var result = (data.query && data.query.results) ? data.query.results.quote : {},
                            resultContent = '';

                        if (!result.Ask) {
                            resultContent += "<div class='smithyGadget'>No results found for " + searchTerm + "</div>";
                        } else {
                            resultContent += "<div class='smithyGadget'>";
                            resultContent += "<div><span class='stockName'>" + result.Name + "</span> - (" + searchTerm + ")</div>";
                            resultContent += "<div class='stockLeftDiv'>";
                            resultContent += "Previous Close: " + result.PreviousClose + "<br />";
                            resultContent += "Open: " + result.Open + "<br />";
                            resultContent += "Bid: " + result.Bid + "<br />";
                            resultContent += "Ask: " + result.Ask + "<br />";
                            resultContent += "</div>";

                            resultContent += "<div class='stockLeftDiv'>";
                            resultContent += "Day's Range: " + result.DaysRange + "<br />";
                            resultContent += "Year Range: " + result.YearRange + "<br />";
                            resultContent += "Volume: " + result.Volume + "<br />";
                            resultContent += "Average Volume: " + result.AverageDailyVolume + "<br />";
                            resultContent += "</div>";
                            resultContent += "</div>";
                        }
                        domConst.place(resultContent, container);
                        _this.showPlaceHolder(false);
                        _this.gadgetSpace.resize();
                    }
            });
        }
    });
    return StockGadget;
});