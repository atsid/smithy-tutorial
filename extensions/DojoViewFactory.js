/**
 * @class DojoViewFactory
 * Extend the smithy/DojoViewFactory for now... push to smithy when worked out.
 * Allow views to be configurable.
 */
define([
    "smithy/declare",
    "smithy/dojoviews/DojoBorderView",
    "smithy/dojoviews/DojoViewFactory"
], function (
    declare,
    BorderContainer,
    DojoViewFactory
) {
    var module = declare(DojoViewFactory, {

        constructor: function (config) {
            this.cfg = config;
        },

        createView: function (area, mode, cfg) {
            var tag = (area.isWindow ? this.rootTag : area.getAddress());

            if (mode === "borders") {
                view = new BorderContainer(
                    (cfg && cfg.border) || this.cfg.border || {
                        style: "height:100%; width:100%"
                    },
                    tag);
            } else {
                view = this.inherited(arguments)
            }
            return view;
        }

    });

    return module;

});


