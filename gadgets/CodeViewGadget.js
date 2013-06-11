/**
 * @class LessonGagdet
 * A gadget to display code based on a HighlightSource message.
 */

define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dojo/dom",
    "dojo/query",
    "dojo/dom-style",
    "codeview/codeview"
], function (
    declare,
    Gadget,
    Container,
    ContentPane,
    dojoDom,
    dojoQuery,
    dojoStyle,
    codeview
) {

    return declare([Container, ContentPane, Gadget], {

        constructor: function (config) {
            this.contentType = "javascript";
            this.splitter = true;
        },

        name: "CodeViewGadget",
        title: "View Code",

        /**
         * Listen on the LessonSelect channel for lessons to display.
         * Publish on the HighlightSource channel to ask a highlight gadget to
         * show source.
         */
        setupMessaging: function() {
            var that = this, tmp;
            this.registerSubscriber("HighlightSource", function (msg) {
                if (msg.source.indexOf(".htm") !== -1) {
                    that.contentType = "html";
                } else {
                    that.contentType = "javascript";
                }
                if (msg.source) {
                    that.set("href", msg.source);
                } else {
                    that.set("content", "<pre id='codesnippet' class='codeview javascript'>No code to display.</pre>");
                }
            });
        },

        /**
         * Setup the content pane that will display the source and a listener that
         * will highlight the source when the it has been downloaded by content pane.
         */
        setupView: function () {
            this.inherited(arguments);
            var that = this;
            that.set("content", "<pre id='codesnippet' class='codeview javascript'>No code to display.</pre>");
            this.onDownloadEnd = function () {
                var txt = that.get("content"),
                    cheight = (that.domNode.offsetHeight - 50),
                    cwidth = (that.domNode.offsetWidth - 30),
                    style = "style='width:" + cwidth + "px; height:" + cheight + "px'";
                txt = "<pre id='codesnippet' class ='codeview " + that.contentType + "' " + style + ">" + txt + "</pre>";
                that.set("content", txt);
                codeview.scan();
            };
        },

        /**
         * track resize so it can be passed on to codeview.
         */
        resize: function(evt) {
            this.inherited(arguments);
            var cheight = (this.domNode.offsetHeight - 50),
                cwidth = (this.domNode.offsetWidth - 30),
                style = {width: cwidth + "px", height: cheight + "px"},
                node = dojoDom.byId("codesnippet");

            dojoStyle.set("codesnippet", style);
            //dojoStyle.set('.iframe', style);
            var t = dojoQuery("iframe");
            if (t[0]) {
                dojoStyle.set(t[0], style);
            }
        }
    });
});
