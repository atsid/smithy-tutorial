{
    pointcut: "service1.*",
    type: 'url',
    fn: function (url, method) {
        return "prepended" + url + "appended";
    }
}
