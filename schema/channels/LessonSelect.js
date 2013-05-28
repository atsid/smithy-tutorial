define({
    "id": "schema/LessonSelect",
    "description": "Channel publishing changes in the selection of a lesson",
    "$schema": "http://json-schema.org/draft-03/schema",
    "type": "object",
    "properties": {
        "selected": {
            "type": "boolean",
            "description": "true if selected false if de-selected",
            "required": true
        },
        "lesson": {
            "type": "string",
            "description": "Id of the lesson content",
            "required": true
        }
    }
});