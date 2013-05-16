define({
    "id": "schema/services/TutorialService",
    "SMDVersion": "2.0",
    "$schema": "http://json-schema.org/draft-03/schema",
    "transport": "REST",
    "envelope": "PATH",
    "description": "Retrieve Information about .",
    "contentType": "application/json",
    "target": "services",
    "parameters": [
        {
            "name": "id",
            "type": "string",
            "envelope": "URL",
            "description": "The id of an object.",
            "required": false
        }
    ],
    "services": {
        "getSyllabus": {
            "transport": "GET",
            "target": "syllabus",
            "description": "Gets a syllabus.",
            "returns": {
                "$ref": "schema/models/Syllabus"
            }
        },
        "getLesson": {
            "transport": "GET",
            "target": "lesson",
            "description": "Gets a lesson belonging to a syllabus.",
            "returns": {
                "$ref": "schema/models/LessonContent"
            }
        }
    }
});