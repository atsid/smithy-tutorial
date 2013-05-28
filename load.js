/**
 * Simple script to load data.
 */
var mongoose = require('mongoose')
    , lesson
    , syllabus
    , LessonContent = require("./schema/models/mongoose/LessonContent")
    , Syllabus = require("./schema/models/mongoose/Syllabus");

mongoose.connect("mongodb://cloudbees:dba69a3b8d21d8f16c1393935dbab7bf@alex.mongohq.com:10018/BYe5thvosvLkf8H88k10Tg", function () {

    // need to do this in a connect to be sure the native calls can be executed.
    console.log("dropping syllabuses collection.");
    mongoose.connection.db.dropCollection("syllabuses");
    console.log("dropping lessoncontents collection.");
    mongoose.connection.db.dropCollection("lessoncontents");

    lesson = new LessonContent({
        content: "Content for lesson 1",
        sourceFile: "index.html",
        highlightBegin: "^.",
        highlightEnd: ".$"}
    );
    syllabus = new Syllabus({
        title: "Lesson 1",
        content: [lesson._id]
    });
    lesson.save();
    syllabus.save();
   new Syllabus({
        title: "Smithy Tutorial",
        isRoot: true, content: [],
        lessons: [syllabus._id]}
   ).save();
});
