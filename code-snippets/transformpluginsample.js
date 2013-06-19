// request plugins get the entire request payload and a headers map
// they can be executed on any request and are processed before write plugins
{
    pattern: "[^.]*.put.*",
    type: 'request',
    fn: function (data, method, headers) {
        headers.From = "admin@atsid.com";
        return data;
    }
}

// response plugins get the entire response payload.
// they can only be executed on service methods that expect a payload
// are processed before read plugins
{
    pointcut: "service1.get*",
    type: 'response',
    fn: function (data, params, ioArgs) {
        data.internal = "mark";
        return data;
    }
}

// Write plugins get an interpreted payload. If the service specifies a payload
// property on the request, only the contents of that property is passed and
// if the payload is an array, the plugin is called on each member of the array.
{
    pointcut: "service1.put*",
    type: 'write',
    fn: function (data, method) {
        return data.prop;
    }
}

// read plugins get an interpreted payload. If the service specifies a payload
// property on the response, only the contents of that property is passed and
// if the payload is an array, the plugin is called on each member of the array.
{
    pointcut: "service1.get*",
    type: 'read',
    fn: function (data, params) {
        return data.prop;
    }
}
