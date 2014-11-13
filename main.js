/**
 * Simple express app to serve tutorial pages and services.
 */
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , restsmd = require('./rest/rest-smd')
  , path = require('path');

var app = express();
console.log("db - " + process.env.PARAM1);
app.set('port', process.env.PORT || 3000);
app.get("/editor.html", function(req, res) {
    res.send("Not Now...");
});

// if there isn't a mongo instance then serve up
// the demo-only page as root.
if (process.env.PARAM1) {
    restsmd(app, {
        mongoInstance: process.env.PARAM1,
        modelDir: "./schema/models/mongoose",
        appDir: process.cwd() + '/'
    });
} else {
    app.get("/", function(req, res) {
        res.sendfile("demo-only.html");
    });
}
app.use(express.static(__dirname));

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
