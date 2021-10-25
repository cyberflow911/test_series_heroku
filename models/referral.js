const mongoose = require('mongoose');

const {Schema} = mongoose;

const Refferals = new Schema(
    {
        userID:
        {
            type: String,
            default: ''
        },
       email: 
       {
           type: String,
           default: ''
       },
       userType:
       {
           type: Number,
           enum: [0,1,2],
           default: 2
       },
       commisionPercent:
    //    testnaem 
    //    course code 
    //    questions
    //    right answer
    //    status 
    //    duration
    //    rank
       {
           type: Number,
           default: ''
       },
       referralCode:
       {
           type: String,
           default: ''

       }

    },{timestamps: true}
)

const Referral = mongoose.model("Referral", Refferals);

exports.Referral = Referral;