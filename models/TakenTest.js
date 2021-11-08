const mongoose = require('mongoose');

const {Schema} = mongoose;

const TestHistories = new Schema(
    {

       userID:
       {
           type: String,
           required: true
       },
       testID:
       {
           type: String,
           required: true
       },
       totalMarks:
       {
           type: Number,
           required: true
       },
       resultStatus:
       {
           type: Boolean,
           default: true
       },
       questionAttempted:
       [
           {
               questionID:
               {
                   type: Schema.Types.ObjectId,
                   ref: "Question"
               },
               attemptedOption:
               {
                   type: String,
                   default: ''
               },
               correctAnswer:
               {
                   type: String,
                   default: ''
               }

           }
       ]

    },{timestamps: true}
)

const TestHistory = mongoose.model("TestHistory", TestHistories );

exports.TestHistory = TestHistory;