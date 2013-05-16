define([
    "smithy/declare",
    "./BaseDemoGadget",
    "smithy/Gadget",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/layout/ContentPane",
    "dojo/dom-construct"
], function (
    declare,
    BaseDemoGadget,
    Gadget,
    Button,
    TextBox,
    ContentPane,
    domConst
) {

    /**
     * A simple stock feed gadget to demo a dojo gadget.
     * @class StockGadget
     * A simple StockGadget gadget
     */

    return declare("StockGadget", [BaseDemoGadget], {

        name: "StockGadget",
        title: "Stock",
        searchLabel: "Get Stock",
        searchPlaceHolder: "Enter stock symbol. Defaults AMZN",



        getParams: function (scope, searchTerm, targetNode) {
            return {
                url: "https://query.yahooapis.com/v1/public/yql",
                callbackParamName: "callback",
                content: {
                    q: "select * from yahoo.finance.quotes where symbol = '" + searchTerm + "'",
                    format: "json",
                    diagnostics: true,
                    env: "store://datatables.org/alltableswithkeys"
                },
                load: function (data) {
                    // Set the data from the search into the viewbox in nicely formatted JSON
                    var result = (data.query && data.query.results) ? data.query.results.quote : {}, i, resultContent = "<div />";

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
                    domConst.place(resultContent, targetNode);
                    scope.showPlaceHolder(false);
                },
                error: function (error) {
                    domConst.place("<p>There was a problem accessing Yahoo: " + error + "</p>", targetNode);

                    scope.showPlaceHolder(false);
                }
            };
        }
    });
});