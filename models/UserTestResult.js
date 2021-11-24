const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserTestResultSchema = new Schema(
	{
		userID: {
			type: Schema.Types.ObjectId,
			ref: "Admin",
		},
		testId: {
			type: Schema.Types.ObjectId,
			ref: "Test",
		},
        userTotalMarks:
        {
            type: Number,    
        },
        rank:
        {
            type: Number,
        },
        correctQues:
        {
            type:Number,
        },
        wrongQues:
        {
            type:Number
        },
        timeLeft:
        {
            type:String,
        },
        skippedQues:
        {
            type:Number,
        },
        accurracy:
        {
            type:Number,
        },
        mainContentEnglish: [
			{
                sectionId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Section",
                    required: true,
			    },
                correctQues: Number,
                wrongQues: Number,
                markedQues:Number,
                remaining: Number,
                questions:
                [
                    {
                         questionId:{ 
                            type: Schema.Types.ObjectId,
                            required: true,
                            ref: "Question",
                            unique: true,
                         },
                         status:String,
                         isAttempted:Boolean,
                         userResponse:String
                    }
                ]
            }

		],
		mainContentHindi: [
			{
                sectionId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Section",
                    required: true,
			    },
                correctQues: Number,
                wrongQues: Number,
                markedQues:Number,
                remaining: Number,
                questions:
                [
                    {
                         questionId:{ 
                            type: Schema.Types.ObjectId,
                            required: true,
                            ref: "Question",
                            unique: true,
                         },
                         status:String,
                         isAttempted:Boolean,
                         userResponse:String
                    }
                ]
			},
		],
        
		 
	},
	{
		timestamps: true,
	}
);

const UserTestResult = model("UserTestResult", UserTestResultSchema);

module.exports = UserTestResult;
