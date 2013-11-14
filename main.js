/**
 * Simple express app to serve tutorial pages and services.
 */
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , restsmd = require('./rest/rest-smd')
  , path = require('path');

var app = express();
console.log("db - " + process.env.mongoinstance);
app.set('port', process.env.PORT || 3000);
app.get("/editor.html", function(req, res) {
    res.send("Not Now...");
});
app.use(express.static(__dirname));

restsmd(app, {
    mongoInstance: process.env.mongoinstance,
    modelDir: "./schema/models/mongoose",
    appDir: process.cwd() + '/'
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
