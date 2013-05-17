define({
	"id": "schema/models/LessonContent",
	"description": "The set of textual content that comprises this lesson",
	"$schema": "http://json-schema.org/draft-03/schema",
	"type": "object",
	"properties": {
		"content": {
			"type": "string",
			"description": "Textual Content",
			"required": true
		},
        "sourceFile": {
            "type": "string",
            "description": "Name of related source."
        },
        "highlightBegin": {
            "type": "string",
            "description": "Regular expression for beginning of source highlight."
        },
        "highlightEnd": {
            "type": "string",
            "description": "Regular expression for end of source highlight."
        }
	}
});