define([
    "smithy/declare",
    "smithy/Gadget",
    "dojo/dom-construct",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/Toolbar",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/DropDownMenu",
    "dijit/MenuItem",
    "dijit/form/ComboButton",
    "dijit/form/ToggleButton",
    "dijit/form/DateTextBox",
    "dijit/form/TextBox"
], function (
    declare,
    Gadget,
    domConstruct,
    BorderContainer,
    ContentPane,
    Toolbar,
    Button,
    DropDownButton,
    DropDownMenu,
    MenuItem,
    ComboButton,
    ToggleButton,
    DateTextBox,
    TextBox
) {

/**
 * @class NavigationGadget
 * Displays links for available gadgets.
 */

    return declare([ContentPane, Gadget], {

        name: "NavigationGadget",

        constructor: function (data) {
            this.title = 'Available Gadgets';
            this.style = data.initData.style;
        },

        setupView: function () {
            this.inherited(arguments);
            var bc = new BorderContainer({gutters: false, style: "height: 100%; width: 100%"}),
                toolbar,
                center;
            bc.placeAt(this.domNode);


            center = new ContentPane({region: "center"});
            bc.addChild(center);

            this.addControls(center.domNode);

            bc.startup();
        },

        addControls: function (targetNode) {

            domConstruct.create("h2", {innerHTML: this.title}, targetNode);

            var menu = new DropDownMenu({ style: "display: none;"});
            var menuItem1 = new MenuItem({
                label: "Open Right",
                iconClass:"dijitEditorIcon dijitEditorIconSave",
                onClick: function(){
                    alert('save');
                }
            });
            menu.addChild(menuItem1);

            var menuItem2 = new MenuItem({
                label: "Open Bottom",
                iconClass:"dijitEditorIcon dijitEditorIconCut",
                onClick: function(){ alert('cut'); }
            });
            menu.addChild(menuItem2);

            (new DropDownButton({
                label: "button",
                name: "twitterGadgetOpener",
                dropDown: menu,
                id: "twitBtn",
                onClick: function () {
                    console.log("Open in default location");
                },
                onFocus: function () {
                    this.openDropDown();
                },
                onMouseEnter: function () {
                    this.openDropDown();
                }
            })).placeAt(targetNode);

            (new TextBox({
                label: "text box"
            })).placeAt(targetNode);
        }
    });
});
