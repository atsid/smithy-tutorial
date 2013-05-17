define({
	"id": "schema/models/Syllabus",
	"description": "A syllabus for a turorial",
	"$schema": "http://json-schema.org/draft-03/schema",
	"type": "object",
	"properties": {
		"title": {
			"type": "string",
			"description": "The title of this syllabus or lesson",
			"required": false
		},
        "content": {
            "type": "array",
            "description": "Textual/link content for the lesson.",
            "required": false,
            "items": {
                "$ref": "schema/models/LessonContent"
            }
        },
		"lessons": {
			"type": "array",
			"description": "Breakdown into sub-lessons if appropriate.",
			"required": false,
			"items": {
				"$ref": "schema/models/Syllabus"
			}
		}
	}
});