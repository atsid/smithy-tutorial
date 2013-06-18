// Address are used when loading a gadget into the gadget space.
gadgetSpace.loadGadgetTo("SearchGadget", "windows[0]/top", true, {class: "gadget"});

// Addresses are used in status messages.
// e.g. an area status message could look like:
{
    address: "windows[0]/top",
    status: "CREATED"
}

// Addresses can be used to retrieve an area from the gadget space
var area = gadgetSpace.getArea("windows[0]/top");
// and can be relative
var area = mainWindowArea.getArea("top");

// Addresses are used to remove areas
var removedArea = gadgetSpace.removeArea("windows[0]/top");

// Areas can report their addresses
var address = area.getAddress();
