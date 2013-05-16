/**
 * Simple script to load data.
 */
var mongoose = require('mongoose')
    , connection = mongoose.connect("mongodb://cloudbees:dba69a3b8d21d8f16c1393935dbab7bf@alex.mongohq.com:10018/BYe5thvosvLkf8H88k10Tg")
    , lesson
    , syllabus
    , LessonContent = require("./schema/models/mongoose/LessonContent")
    , Syllabus = require("./schema/models/mongoose/Syllabus");

lesson = new LessonContent({content: "Content for lesson 1", sourceFile: "index.html", highlightBegin: "^.", highlightEnd: ".$"});
lesson.save(function (err) {
    syllabus = new Syllabus({title: "Lesson 1", content: [lesson._id]});
    syllabus.save(function (err) {
        new Syllabus({title: "Smithy Tutorial", content: [], lessons: [syllabus._id]}).save();
    });
});