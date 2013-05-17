/**
 * A Node.js rest server implementation.
 */
var mongoose = require('mongoose'),
    router = require('./router'),
    generator = require('mongoose-gen'),
    express = require("express"),
    fs = require('fs-extra'),
    requirejs = require('requirejs');

module.exports = function (app, config) {

    requirejs.config({
        //Pass the top-level main.js/index.js require
        //function to requirejs so that node modules
        //are loaded relative to the top-level JS file.
        nodeRequire: require,
        paths: {
            "circuits-js": "./node_modules/circuits-js"
        }
    });

    var ZypSMDReader = requirejs('circuits-js/ZypSMDReader'),
        mongooseConnection = config.connection,
        servicesDir = config.servicesDir;

// Resolver for ZypSMDReader.
    var smdResolver = function (smd) {
        return requirejs(smd);
    };

    generator.setConnection(mongooseConnection);

// Generate Mongoose schema for each SMD file in 'services' directory
    fs.readdir(config.appDir + servicesDir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) { fs.readFile(config.appDir + servicesDir + '/' + file, 'UTF-8', function(err, data) {
            if (err) throw err;
            var smd = requirejs(servicesDir + '/' + file.split('.')[0]),
                reader = newReader(smd),
                generatedModels = {};
            methodNames = reader.getMethodNames();
            for (var i = 0; i < methodNames.length; i++) {
                var methodName = methodNames[i],
                    responseSchema = reader.getResponseSchema(methodName),
                    modelName = responseSchema.id.split('/').pop(),
                    model,
                    serviceUrl = reader.getServiceUrl(methodName),
                    pathName = serviceUrl;
                try {
                    if (!generatedModels[modelName]) {
                        model = require(config.appDir + config.modelDir + "/mongoose/" + modelName);
                        generatedModels[modelName] = model;
                    }
                    router(modelName, pathName, true, app, [express.bodyParser()]);
                } catch (exception) {
                    throw exception;
                }
            }
            console.log("Added the following services: " + JSON.stringify(app.routes, undefined, 4));
        })
        })
    });

    /**
     * Retrieves a reader capable of handling the passed service descriptor.
     *
     * @param {Object} smd - the service descriptor to retrieve a reader for.
     */
    function newReader(smd) {
        // zyp format by default.
        var ret = new ZypSMDReader(smd, smdResolver);
        if (!smd.SMDVersion) {
            //not zyp then fail.
            throw new InvalidArgErr();
        }
        return ret;
    }
}
