/**
 * @class LessonGagdet
 * A gadget to display a series of paragraphs related to a lesson.
 */

define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "amd-plugins/jsonschema!application/schema/services/TutorialService"
], function (
    declare,
    Gadget,
    Container,
    ContentPane,
    Button,
    TutorialService
) {

    return declare([Container, ContentPane, Gadget], {

        constructor: function (config) {
            this.class = config.initData.class;
            this.splitter = true;
            this.pcontent = [];
            this.pcurrent = -1;
        },

        name: "LessonGadget",
        title: "Lesson Display",

        /**
         * Use the tutorial service to retrieve content data.
         */
        setupServices: function () {
            this.registerService(TutorialService);
        },

        /**
         * Listen on the LessonSelect channel for lessons to display.
         * Publish on the HighlightSource channel to ask a highlight gadget to
         * show source.
         */
        setupMessaging: function() {
            var that = this;
            this.registerSubscriber("LessonSelect", function (msg) {
                if (msg.selected) {
                    that.TutorialService.getSyllabus({id: msg.lesson}, {
                        load: function (data) {
                            that.pcontent = data.content;
                            that.pcurrent = -1;
                            that.changeContent(true)
                        }
                    });
                }
            });
            this.registerPublisher("HighlightSource");
        },

        changeContent: function (forward) {
            var that = this,
                current = forward ? that.pcurrent + 1 : that.pcurrent - 1;

            that.previous.set("disabled", current === 0 ? true : false);
            that.next.set("disabled", current === (that.pcontent.length - 1) ? true : false);
            that.contentPane.set("content",
                current < that.pcontent.length ? that.pcontent[current].content : "<p>Select a lesson...</p>");
        },

        /**
         * Add another content pane and navigation buttons to the
         * This gadget only contains a tree widget.
         */
        setupView: function () {
            this.inherited(arguments);
            var that = this;

            that.contentPane = new ContentPane({content: "<p>Select a lesson...</p>"});
            that.previous = new Button({label: "Previous"});
            that.next = new Button({label: "Next"});

            this.previous.on("click", function (evt) {
                that.changeContent(false);
            });
            this.next.on("click", function (evt) {
                that.changeContent(true);
            });

            that.addChild(that.contentPane);
            that.addChild(that.previous);
            that.addChild(that.next);
        }
    });
});
