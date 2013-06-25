{
    "id": "models/ExampleModel",
    "description": "Example Model Schema",
    "$schema": "http://json-schema.org/draft-03/schema",
    "type": "object",
    "extends": {
        "$ref": "models/BaseModel"
    },
    "properties": {
        "aProperty": {
            "type": "string",
            "description": "an example property with min max",
            "required": true,
            "minimum": 1,
            "maximum": 100
        },
        "aRefProperty": {
            "$ref": "models/OtherModel"
        }
    }
}
