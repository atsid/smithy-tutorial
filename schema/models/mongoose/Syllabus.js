var mongoose = require("mongoose"),
    Syllabus = new mongoose.Schema({
    "title": String,
    "lessons": [{type: mongoose.Schema.Types.ObjectId, ref: 'Syllabus'}],
    "content": [{type: mongoose.Schema.Types.ObjectId, ref: 'LessonContent'}]
});
module.exports = mongoose.model("Syllabus", Syllabus);

