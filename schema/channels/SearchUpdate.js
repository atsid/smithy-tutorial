define({
    "id": "schema/SearchUpdate",
    "description": "A simple channel to notify gadgets that the search term has changed",
    "$schema": "http://json-schema.org/draft-03/schema",
    "type": "object",
    "properties": {
        "searchTerm": {
            "type": "string",
            "description": "Text being searched.",
            "required": true
        }
    }
});