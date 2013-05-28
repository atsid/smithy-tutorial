var mongoose = require('mongoose');

module.exports = function (modelName, pathName, autoRoute, app, middleWare) {
    var Model = mongoose.model(modelName),
        index, create, destroy, update, show, populate, _getQuery;

    _getQuery = function (req) {
        var query = req.query.query ? JSON.parse(req.query.query) : {},
            options = {},
            fields = req.query.fields ? JSON.parse(req.query.fields) : '',
            opCheck = ['limit', 'sort', 'skip', 'lean', 'explain', 'timeout'],
            o;

        for (o in req.query) {
            if (opCheck.indexOf(o) >= 0) {
                options[o] = JSON.parse(req.query[o]);
            }
        }
        return {
            options: options,
            fields: fields,
            query: query
        }
    }

    index = function (req, res, next) {
        var query = _getQuery(req);

        Model.find(query.query, query.fields, query.options, function (err, docs) {
            if (err) {
                throw err;
            } else {
                if (autoRoute) {
                    res.json(docs);
                } else {
                    next();
                }
            }
        })
    }

    show = function (req, res, next) {
        Model.findOne({
            _id: req.params.id
        }, function (err, doc) {
            if (err) {
                throw err;
            } else {
                if (autoRoute) {
                    res.json(doc);
                } else {
                    next();
                }
            }
        })
    }

    populate = function (req, res, next) {
        var paths = "";
        Model.schema.eachPath(function (pathname, type) {
            var stype = type.options.type,
                stypes = mongoose.Schema.Types;
            if (stype === stypes.ObjectId) {
                paths = paths + pathname + " ";
            } else if (Array.isArray(stype)) {
                stype.some(function (val) {
                    if (val.type === stypes.ObjectId) {
                        paths = paths + pathname + " ";
                        return true;
                    }
                });
            }
        });
        Model.findOne({
            _id: req.params.id
        }).populate(paths).exec(function (err, doc) {
            if (err) {
                throw err;
            } else {
                if (autoRoute) {
                    res.json(doc);
                } else {
                    next();
                }
            }
        });
    }

    update = function (req, res, next) {
        var key;
        Model.findOne({
            _id: req.params.id
        }, function (err, doc) {
            if (err) {
                throw err;
            } else {
                for (key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        doc[key] = req.body[key];
                    }
                }
                doc.save(function (err, newDoc) {
                    if (err) {
                        throw err;
                    } else {
                        req.docs = newDoc;
                        if (autoRoute) {
                            res.send(JSON.stringify(req.docs));
                        } else {
                            next();
                        }
                    }
                });
            }
        })
    }

    destroy = function (req, res, next) {
        Model.findOne({
            _id: req.params.id
        }, function (err, doc) {
            if (err) {
                throw err;
            } else {
                if (doc) {
                    doc.remove();
                    req.docs = doc;
                    if (autoRoute) {
                        res.send(JSON.stringify(req.docs));
                    }
                } else {
                    next();
                }
            }
        })
    }

    create = function (req, res, next) {
        var key, doc = new Model(req.body),
            schema = doc.schema.paths;

        doc.save(function (err, newDoc) {
            if (err) {
                throw err;
            } else {
                req.docs = newDoc;
                if (autoRoute) {
                    res.send(JSON.stringify(req.docs));
                } else {
                    next();
                }
            }
        });
    }

    if (autoRoute && app && typeof pathName === "string") {
        app.get("/" + pathName, middleWare, index);
        app.get("/populate/" + pathName + "/:id", middleWare, populate);
        app.get("/" + pathName + "/:id", middleWare, show);
        app.put("/" + pathName + "/:id", middleWare, update);
        app.delete("/" + pathName + "/:id", middleWare, destroy);
        app.post("/" + pathName, middleWare, create);
    }

    return {
        index: index,
        create: create,
        destroy: destroy,
        update: update,
        show: show
    }
}