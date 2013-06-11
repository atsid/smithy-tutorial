/**
 * @class LessonGagdet
 * A gadget to display a series of paragraphs related to a lesson.
 */

define([
    "smithy/declare",
    "smithy/Gadget",
    "smithy/util",
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/Editor",
    "dijit/_editor/plugins/ViewSource",
    "dijit/_editor/plugins/LinkDialog",
    "amd-plugins/jsonschema!application/schema/models/LessonContent",
    "amd-plugins/jsonschema!application/schema/models/Syllabus",
    "amd-plugins/jsonschema!application/schema/services/TutorialService"
], function (
    declare,
    Gadget,
    Util,
    Container,
    ContentPane,
    Button,
    TextBox,
    Editor,
    ViewSourcePlugin,
    LinksPlugin,
    LessonContent,
    Syllabus,
    TutorialService
) {
    var util = new Util();

    return declare([Container, ContentPane, Gadget], {

        constructor: function (config) {
            this.class = config.initData.class;
            this.splitter = true;
            this.pcontent = [];
            this.pcurrent = -1;
        },

        name: "LessonEditorGadget",
        title: "Lesson Editor",

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
                    that.TutorialService.getSlimSyllabus({id: msg.lesson}, {
                        load: function (data) {
                            that.syllabus = that.config.modelFactory.getModelInitialized(data, Syllabus);
                            that.pcurrent = -1;
                            that.sybOrder.set("value", data.order);
                            that.title.set("value", data.title);
                            that.changeContent(true);
                        }
                    });
                }
            });
            this.registerPublisher("HighlightSource");
        },

        changeContent: function (forward) {
            var that = this,
                current = forward ? that.pcurrent + 1 : that.pcurrent - 1,
                pcontent = current < that.syllabus.content.length ?
                    that.syllabus.content[current] : "";

            if (pcontent) {
                that.TutorialService.getLesson({id:pcontent}, {
                    load: function (data) {
                        that.previous.set("disabled", current === 0 ? true : false);
                        that.next.set("disabled", current === (that.syllabus.content.length - 1) ? true : false);
                        that.editor.set("value", data.content || "empty");
                        that.order.set("value", data.order);
                        that.sourceFile.set("value", data.sourceFile || "");
                        that.pcontent = data;
                        that.pcurrent = current;
                        that.config.area.resize();
                    }
                });
            }
        },

        /**
         * Add another content pane and navigation buttons to the
         */
        setupView: function () {
            this.inherited(arguments);
            var that = this;

            that.editor = new Editor({extraPlugins:['viewsource', 'createLink', 'unlink']});
            that.previous = new Button({label: "Previous"});
            that.next = new Button({label: "Next"});
            that.save = new Button({label: "Save"});
            that.newParagraph = new Button({label: "Save As New Paragraph"});
            that.newLesson = new Button({label: "Save As New Lesson"});
            that.deleteLesson = new Button({label: "Delete Lesson"});
            that.deleteParagraph = new Button({label: "Delete Paragraph"});
            that.order = new TextBox();
            that.sourceFile = new TextBox();
            that.title = new TextBox();
            that.sybOrder = new TextBox();

            this.previous.on("click", function (evt) {
                that.changeContent(false);
            });
            this.next.on("click", function (evt) {
                that.changeContent(true);
            });
            this.save.on("click", function (evt) {
                if (that.syllabus.content.length) {
                    that.pcontent.content = that.editor.get("value");
                    that.pcontent.order = that.order.get("value");
                    that.pcontent.sourceFile = that.sourceFile.get("value");
                    that.TutorialService.updateLesson({id: that.pcontent._id, payload: that.pcontent}, {
                        load: function (data) {
                        }
                    });
                }
                that.syllabus.order = that.sybOrder.get("value");
                that.syllabus.title = that.title.get("value");
                that.TutorialService.updateSyllabus({id: that.syllabus._id, payload: that.syllabus}, {
                    load: function (data) {
                        that.syllabus = that.config.modelFactory.getModelInitialized(data, Syllabus);
                    }
                });
            });
            this.newParagraph.on("click", function (evt) {
                var newContent = util.mixin({}, that.pcontent);
                newContent.content = that.editor.get("value");
                newContent.order = that.order.get("value");
                delete newContent._id;
                that.TutorialService.createLesson({payload: newContent}, {
                    load: function (data) {
                        that.syllabus.content.push(data._id);
                        that.TutorialService.updateSyllabus({id: that.syllabus._id, payload: that.syllabus}, {
                            load: function (data) {
                                that.syllabus = that.config.modelFactory.getModelInitialized(data, Syllabus);
                                that.pcurrent = -1;
                                that.changeContent(true);
                            }
                        });
                    }
                });
            });

            this.newLesson.on("click", function (evt) {
                var newContent = util.mixin({}, that.pcontent);
                newContent.content = that.editor.get("value");
                newContent.order = 0
                delete newContent._id;
                that.TutorialService.createLesson({payload: newContent}, {
                    load: function (data) {
                        newContent = util.mixin({}, that.syllabus);
                        delete newContent._id;
                        newContent.content = [data._id];
                        newContent.title = that.sourceFile.get("value");
                        newContent.order = that.order.get("value");
                        that.TutorialService.createSyllabus({payload: newContent}, {
                            load: function (data) {
                                that.syllabus.lessons.push(data._id);
                                that.TutorialService.updateSyllabus({id: that.syllabus._id, payload: that.syllabus}, {
                                    load: function (data) {
                                        that.syllabus = that.config.modelFactory.getModelInitialized(data, Syllabus);
                                        that.pcurrent = -1;
                                        that.changeContent(true);
                                    }
                                });
                            }
                        });
                    }
                });
            });

            this.deleteParagraph.on("click", function (evt) {
                that.TutorialService.deleteLesson({id: that.pcontent._id}, {
                    load: function (data) {
                        that.syllabus.content = that.syllabus.content.filter(function (val, idx) {
                            return idx !== that.pcurrent;
                        });
                        that.TutorialService.updateSyllabus({id: that.syllabus._id, payload: that.syllabus}, {
                            load: function (data) {
                                that.syllabus = that.config.modelFactory.getModelInitialized(data, Syllabus);
                                that.pcurrent = -1;
                                that.changeContent(true);
                            }
                        });
                    }
                });
            });
            this.deleteLesson.on("click", function (evt) {
                that.syllabus.content.forEach(function (val, idx){
                    that.TutorialService.deleteLesson({id: val}, {
                        load: function (data) {
                            if (idx >= that.syllabus.content.length - 1) {
                                that.TutorialService.deleteSyllabus({id: that.syllabus._id}, {
                                    load: function (data) {
                                        that.editor.set("value", "<b>deleted</b>")
                                    }
                                });
                            }
                        }
                    });
                });
            });
            that.addChild(that.editor);
            that.addChild(that.order);
            that.addChild(that.sourceFile);
            that.addChild(that.previous);
            that.addChild(that.next);
            that.addChild(that.save);
            that.addChild(that.newParagraph);
            that.addChild(that.newLesson);
            that.addChild(that.deleteLesson);
            that.addChild(that.deleteParagraph);
            that.addChild(that.title);
            that.addChild(that.sybOrder);
            that.editor.startup();
        }
    });
});
