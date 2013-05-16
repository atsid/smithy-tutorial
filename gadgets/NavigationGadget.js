define([
    "smithy/declare",
    "smithy/ToolGadget",
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
    ToolGadget,
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

    return declare([ContentPane, ToolGadget], {

        name: "NavigationGadget",

        tabsOpen: 1,

        constructor: function (data) {
            this.title = 'Available Gadgets';
            this.style = data.initData.style;
        },

        setupView: function () {
            this.inherited(arguments);
//            this.addButtons();
//            this.set("content", "<h1>" + this.title + "</h1>");

        },

        addButtons: function () {
            var toolbarNode = this.domNode, navGadget = this;
            this.gadgetSpace.enumerateGadgetDescriptors(function (descriptor) {
                new Button({
                    label: descriptor.name,
                    iconClass: "gadgetToggleIcon",
                    onClick: function (data) {
                        navGadget.loadGadget.apply(navGadget, [descriptor.name]);
                    }
                }).placeAt(toolbarNode);
//                this.registeredGadgets.addOption({label: descriptor.name, value: descriptor});
            }, this);

        },

        loadGadget: function (data) {
            var area = this.gadgetSpace.loadGadgetTo(
                data,
                this.tabsOpen === 0 ? "windows[0]/center/center" : "windows[0]/center/center/col[" + this.tabsOpen + "]",
                true
            );
            area.render();
            this.tabsOpen += 1;
        },

        removeGadget: function (data) {
            var area = this.gadgetSpace.removeArea(data);
        }
    });
});
