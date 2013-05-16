define([
    "smithy/declare",
    "smithy/Gadget",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dojox/layout/ContentPane"
], function (
    declare,
    Gadget,
    Button,
    TextBox,
    ContentPane
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
            this.style = config.initData.style;
        },

        name: "TwitterGadget",
        title: "Twitter",
        executeScripts: true,
        content: "<a class='twitter-timeline' href='https://twitter.com/search?q=%23javascript' data-widget-id='332908786408898560'>Tweets about '#javascript'</a>" +
            "<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';" +
            "if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');</script>"


    });
});