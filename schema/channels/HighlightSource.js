define({
    "id": "schema/HighlightSource",
    "description": "Request to high light a section of a source file.",
    "$schema": "http://json-schema.org/draft-03/schema",
    "type": "object",
    "properties": {
        "source": {
            "type": "string",
            "description": "The path to the source to highlight.",
            "required": true
        },
        "begin": {
            "type": "string",
            "description": "Regular expression to match the beginning of the selection.",
            "required": true
        },
        "end": {
            "type": "string",
            "description": "Regular expression to match the end of the selection.",
            "required": true
        }
    }
});