/**
 * A Node.js rest server implementation.
 */
var mongoose = require('mongoose'),
    router = require('./router'),
    express = require("express"),
    fs = require('fs-extra');

module.exports = function (app, config) {

    var mongooseConnection = mongoose.connect(config.mongoInstance);

// Generate Mongoose schema for each SMD file in 'services' directory
    fs.readdir(config.appDir + config.modelDir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            var generatedModels = {},
                modelName = file = file.substring(0, file.indexOf(".js"));
            try {
                if (!generatedModels[modelName]) {
                    model = require(config.appDir + config.modelDir +"/" + modelName);
                    generatedModels[file] = model;
                }
                router(modelName, modelName, true, app, [express.bodyParser()]);
            } catch (exception) {
                throw exception;
            }
        });
        console.log("Added the following services: " + JSON.stringify(app.routes, undefined, 4));
    });
}
