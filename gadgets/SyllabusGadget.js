/**
 * @class SyllabusGagdet
 * A gadget to display a syllabus as a tree.
 */

define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/_Container",
    "dijit/layout/ContentPane",
    "dijit/Tree",
    "dijit/tree/ObjectStoreModel",
    "dojo/store/Observable",
    "dojo/store/Memory",
    "amd-plugins/jsonschema!application/schema/services/TutorialService"
], function (
    declare,
    Gadget,
    Container,
    ContentPane,
    Tree,
    ObjectStoreModel,
    Observable,
    Memory,
    TutorialService
) {

    return declare([Container, ContentPane, Gadget], {

        constructor: function (config) {
            this.class = config.initData.class;
            this.splitter = true;
        },

        name: "SyllabusGadget",
        title: "Smithy Tutorial Syllabus",

        /**
         * Use the tutorial service to retrieve syllabus data.
         */
        setupServices: function () {
            this.registerService(TutorialService);
        },

        /**
         * Use the LessonSelect channel to notify other gadgets of the
         * current selection/de-selection.
         */
        setupMessaging: function() {
            this.registerPublisher("LessonSelect");
        },

        /**
         * Add a tree widget to this gadget after retrieving syllabus data.
         * This gadget only contains a tree widget.
         */
        setupView: function () {
            this.inherited(arguments);
            var that = this
                , myStore
                , myModel
                , tree;

            that.TutorialService.getSyllabuses({}, {
                load: function (data) {
                    var td;
                    // transform data to include a id expected
                    // by dijit/Tree.
                    data.forEach(function (val) {
                        val.id = val._id;
                    });
                    data.sort(function (x, y) {
                        return x.order - y.order;
                    });
                    myStore = new Memory({
                            data: data,//[{id: 0, title: "root", isRoot: true}],
                            getChildren: function(object){
                                return this.query(function (val) {
                                    return (object.lessons && object.lessons.indexOf(val._id) !== -1);
                                });
                            }
                        });

                    // Create the model
                    myModel = new ObjectStoreModel({
                        store: myStore,
                        labelAttr: "title",
                        query: {isRoot: true}
                    });
                    // Create the Tree.
                    tree = new Tree({
                        model: myModel
                    });

                    that.addChild(tree);
                    tree.startup();
                    tree.expandAll();
                    function itemSelected(item, node, evt) {
                        if (that.lastSelected && item !== that.lastSelected) {
                            that.pub.LessonSelect({selected: false, lesson:that.lastSelected._id});
                        }
                        that.lastSelected = item;
                        that.pub.LessonSelect({selected: true, lesson:item._id});
                    }
                    tree.set("selectedItems", [myModel.root.id]).then(function (val) {
                        itemSelected(myModel.root);
                        that.config.area.resize();
                    });
                    tree.on("click", itemSelected);
                }
            });
        }
    });
});
