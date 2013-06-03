define({
    "id": "Schema/YqlSchema",
    "SMDVersion": "2.0",
    "$schema": "http://json-schema.org/draft-03/schema",
    "transport": "JSONP",
    "envelope": "URL",
    "description": "Service to pull data from Twitter's REST API.",
    "contentType": "application/json",
    "jsonpCallbackParameter": "callback",
    "target": "http://search.twitter.com/search.json",
    "services": {
        "getModel": {
            "parameters": [
                {
                    "name": "q",
                    "type": "string",
                    "envelope": "URL",
                    "description": "test parameter.",
                    "optional": false
                }
            ],
            "transport": "JSONP",
            "description": "get a Model.",
            "payload": "",
            "returns": {
                "$ref": "schema/ExampleStockModel"
            }
        }
    }
});