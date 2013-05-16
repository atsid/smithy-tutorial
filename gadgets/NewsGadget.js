define([
    "smithy/declare",
    "./BaseDemoGadget",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dojo/dom-construct"
], function (
    declare,
    BaseDemoGadget,
    Button,
    TextBox,
    domConst
) {

    /**
     * A simple twitter feed gadget to demo a dojo gadget.
     * @class TwitterGadget
     * A simple TwitterGadget gadget
     */

    return declare("NewsGadget", [BaseDemoGadget], {

        name: "NewsGadget",
        title: "News",
        searchLabel: "Get News",
        searchPlaceHolder: "Enter stock symbol. Defaults AMZN",


        getParams: function (scope, searchTerm, targetNode) {
            return {
                url: "https://query.yahooapis.com/v1/public/yql",
                //"http://search.twitter.com/search.json",
                callbackParamName: "callback",
                content: {
                    q: "select * from html where url=\"http://finance.yahoo.com/q?s=" + searchTerm + "\" and xpath='//div[@id=\"yfi_headlines\"]/div[2]/ul/li/a' limit 5",
                    format: "json",
                    diagnostics: true,
                    env: "store://datatables.org/alltableswithkeys"
                },
                load: function (data) {
                    // Set the data from the search into the viewbox in nicely formatted JSON
                    var results = (data.query && data.query.results) ? data.query.results.a : [], i, resultContent = "<div />", currResult, srcUrl, content;

                    if (results.length === 0) {
                        resultContent += "<div class='smithyGadget'>No results found for " + searchTerm + "</div>";
                    } else {
                        for (i = 0; i < results.length; i += 1) {
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