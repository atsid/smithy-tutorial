/**
 * @class LessonGagdet
 * A gadget to display a series of paragraphs related to a lesson.
 */

define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dojo/dom",
    "dojo/dom-style",
    "codeview/codeview"
], function (
    declare,
    Gadget,
    Container,
    ContentPane,
    dojoDom,
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
                }
                that.set("href", msg.source);
            });
        },

        /**
         * Add another content pane and navigation buttons to the
         * This gadget only contains a tree widget.
         */
        setupView: function () {
            this.inherited(arguments);
            var that = this;
            that.set("content", "<pre id='codesnippet' class='codeview javascript'>No code to display.</pre>");
            this.onDownloadEnd = function () {
                var loadevt, txt = that.get("content"),
                    cheight = (that.domNode.offsetHeight - 50),
                    cwidth = (that.domNode.offsetWidth - 30),
                    style = "style='width:" + cwidth + "px; height:" + cheight + "px'";
                txt = "<pre id='codesnippet' class ='codeview " + that.contentType + "' " + style + ">" + txt + "</pre>";
                that.set("content", txt);
                codeview.scan();
            };
        },

        /**
         * Add another content pane and navigation buttons to the
         * This gadget only contains a tree widget.
         */
        resize: function(evt) {
            this.inherited(arguments);
            var cheight = (this.domNode.offsetHeight - 50),
                cwidth = (this.domNode.offsetWidth - 30),
                style = {width: cwidth + "px", height: cheight + "px"},
                node = dojoDom.byId("codesnippet");

            dojoStyle.set("codesnippet", style);
            console.log("resize called: " + this.domNode.offsetWidth);
        }
    });
});
