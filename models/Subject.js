const mongoose = require('mongoose');

const {Schema} = mongoose;

const Subjects= new Schema(
    {

      subjectName:
      {
          type: String,
          default: ''
      }

    },{timestamps: true}
)

const Subject = mongoose.model("Subjects", Subjects );

exports.Subject = Subject;