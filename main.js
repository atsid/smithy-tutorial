/**
 * Simple express app to serve tutorial pages and services.
 */
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , restsmd = require('./rest/rest-smd')
  , path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname));

restsmd(app, {
    connection: mongoose.connect("mongodb://cloudbees:dba69a3b8d21d8f16c1393935dbab7bf@alex.mongohq.com:10018/BYe5thvosvLkf8H88k10Tg"),
    servicesDir: "./schema/services",
    modelDir: "./schema/models",
    appDir: process.cwd() + '/'
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
