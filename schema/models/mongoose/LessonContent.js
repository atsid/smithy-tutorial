var mongoose = require("mongoose");
module.exports = new mongoose.Schema({
    content: String,
    sourceFile: String,
    highlightBegin: String,
    highlightEnd: String
});
module.exports = mongoose.model("LessonContent", module.exports);
