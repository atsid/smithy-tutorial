define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/layout/ContentPane",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/json",
    "dojo/io/script",
    "dojo/_base/lang"
], function (
    declare,
    Gadget,
    Button,
    TextBox,
    ContentPane,
    domConst,
    dom,
    JSON,
    ioScript,
    lang
) {

/**
 * A simple twitter feed gadget to demo a dojo gadget.
 * @class TwitterGadget
 * A simple TwitterGadget gadget
 */

    return declare([ContentPane, Gadget], {

        constructor: function (config) {
            this.ApplicationTitle = (config && config.initData && config.initData.applicationTitle) ||
                "Twitter Feed";
        },

        name: "TwitterGadget",

        /**
         * Set up form
         */
        setupView: function () {
            var refreshBtn, searchBox, containerNode, tweetSearchNode;
            this.inherited(arguments);
            this.set("content", "<h2>" + this.ApplicationTitle + "</h2>");


            containerNode = domConst.create("div", {"class": "tweetFeedContainer"}, this.domNode);

            tweetSearchNode = domConst.create("div", {"class": "tweetSearch"}, containerNode);

            this.searchBox = new TextBox({
                label: "Search Term",
                placeHolder: "JavaScript",
                style: "padding: 0em 1em;"
            }).placeAt(tweetSearchNode);

            refreshBtn = new Button({
                label: "Refresh Feed",
                onClick: lang.hitch(this, this.getFeed)
            });
            refreshBtn.placeAt(tweetSearchNode);

            this.tweetContainerNode = domConst.create("div", {"class": "tweetFeed"}, containerNode);
            this.placeHolder = dojo.create("p", {innerHTML: "Requesting Tweets...", style: "display: none"}, containerNode);


        },

        /**
         * Utility method for showing/hiding loading text.
         * @param {boolean} show true if loading text should be displayed
         */
        showPlaceHolder: function (show) {
            this.placeHolder.style.display = show ? "block" : "none";

        },


        /**
         * Get's twitter feed using JSONP and loads the result on to the page.
         */
        getFeed: function () {
            var _this = this, targetNode = _this.tweetContainerNode, params, searchBox = _this.searchBox,
                searchTerm = searchBox.value || "JavaScript";
            targetNode.innerHTML = ''; //clear old results

            _this.showPlaceHolder(true);

            // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
            params = {
                url: "http://search.twitter.com/search.json",
                callbackParamName: "callback",
                content: {
                    q: searchTerm
                },
                load: function (data) {
                    // Set the data from the search into the viewbox in nicely formatted JSON
                    var results = data.results, i, resultContent = "", currResult, imgUrl, fromUser;

                    for (i = 0; i < results.length; i += 1) {
                        currResult = data.results[i];
                        imgUrl = currResult.profile_image_url;
                        fromUser = currResult.from_user;
                        resultContent += "<div class='smithyTweet'>";
                        resultContent += imgUrl ? "<a href='https://twitter.com/" + fromUser + "' title='link to " +
                            fromUser + " profile' target='_blank'><img src='" +
                            imgUrl + "' title='twitter profile picture' class='tweetImg'/></a>" : '';
                        resultContent += _this.highlightSearchTerm(_this.replaceURLWithHTMLLinks(currResult.text), searchTerm);
                        resultContent += "</div>";

                    }
                    domConst.place(resultContent, targetNode);
                    _this.showPlaceHolder(false);
                },
                error: function (error) {
                    domConst.place("<p>There was a problem accessing Twitter: " + error + "</p>", targetNode);

                    _this.showPlaceHolder(false);
                }
            };
            ioScript.get(params);
        },

        /**
         * Replaces link text with HTML link
         * @param {string} text to be searched
         * @returns {string} text with links marked up
         */
        replaceURLWithHTMLLinks: function (text) {
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
        },

        /**
         * Highlights instances of search term in text
         * @param {string} text to be searched and marked up.
         * @param {string} term to be highlighted
         * @returns {string} marked up text.
         */
        highlightSearchTerm: function (text, term) {
            return text.replace(term, "<span class='searchText'>" + term + "</span>");
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