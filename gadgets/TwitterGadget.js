define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/form/Button",
    "dijit/layout/ContentPane",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/json",
//    "dojo/request/script",
    "dojo/io/script",
    "dojo/_base/lang"
], function (
    declare,
    Gadget,
    Button,
    ContentPane,
    domConst,
    dom,
    JSON,
//    script,
    ioScript,
    lang
) {

/**
 * @class TwitterGadget
 * A simple TwitterGadget gadget
 */

    return declare([ContentPane, Gadget], {

        constructor: function (config) {
            this.ApplicationTitle = (config && config.initData && config.initData.applicationTitle) ||
                "Twitter Feed for 'JavaScript'";
        },

        name: "TwitterGadget",

        setupView: function () {
            var refreshBtn, placeHolder, containerNode;
            this.inherited(arguments);
            this.set("content", "<h1>" + this.ApplicationTitle + "</h1>");

            refreshBtn = this.refreshBtn = new Button({
                label: "Refresh Feed",
                onClick: lang.hitch(this, this.getFeed)
            });
            refreshBtn.placeAt(this.domNode);


            containerNode = this.containerNode = dojo.create("div", null, this.domNode);
            placeHolder = this.placeHolder = dojo.create("p", {innerHTML: "Requesting Tweets...", style: "display: none"}, containerNode);


        },

        showPlaceHolder: function (show) {
            this.placeHolder.style.display = show ? "block" : "none";

        },
//
//        For some reason this form does NOT work until api 1.9 (not available in cdn)  Using above depricated method.
//        getFeed: function() {
//            script.get("http://search.twitter.com/search.json?q=JavaScript&rpp=5", {
//                jsonp: "callback"
//            }).then(function(data){
//                    alert("data came back!");
//                domConst.place("<p>response data: <code>" + JSON.stringify(data) + "</code></p>", this.domNode);
//            });
//        },



        getFeed: function () {
            var _this = this, targetNode = this.containerNode, jsonpArgs;
            targetNode.innerHTML = ''; //clear old results
            _this.showPlaceHolder(true);

            // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
            jsonpArgs = {
                url: "http://search.twitter.com/search.json",
                callbackParamName: "callback",
                content: {
                    rpp: 10,
                    q: "JavaScript"
                },
                load: function(data) {
                    // Set the data from the search into the viewbox in nicely formatted JSON
                    var results = data.results, i;

                    console.log(results.length);
                    for (i = 0; i < results.length; i++) {
                        domConst.place("<p>" + data.results[i].text + "</p>", targetNode);
                    }
                    _this.showPlaceHolder(false);
                },
                error: function(error) {
                    domConst.place("<p>There was a problem accessing Twitter: " + error + "</p>", targetNode);

                    _this.showPlaceHolder(false);
                }
            };
            ioScript.get(jsonpArgs);
        }

    });
});



/*------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------------

function searchTwitter(query) {
    $.ajax({
        url: 'http://search.twitter.com/search.json?' + jQuery.param(query),
        dataType: 'jsonp',
        success: function(data) {
            var tweets = $('#tweets');
            tweets.html('');
            for (res in data['results']) {
                tweets.append('<div>' + data['results'][res]['from_user'] + ' wrote: <p>' + data['results'][res]['text'] + '</p></div><br />');
            }
        }
    });
}

$(document).ready(function() {
    $('#submit').click(function() {
        var params = {
            q: $('#query').val(),
            rpp: 5
        };
        // alert(jQuery.param(params));
        searchTwitter(params);
    });
});
    */