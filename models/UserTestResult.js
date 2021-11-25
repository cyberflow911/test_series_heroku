const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserTestResultSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "Admin",
            required:true
		},
		testId: {
			type: Schema.Types.ObjectId,
			ref: "Test",
            required:true
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
                type: Schema.Types.ObjectId,
                ref:"UserTestSectionResult",
                unique: true, 
            }

		],
		mainContentHindi: [
            {
                type: Schema.Types.ObjectId,
                ref:"UserTestSectionResult",
                unique: true, 
            },
		],
        
		 
	},
	{
		timestamps: true,
	}
);

const UserTestResult = model("UserTestResult", UserTestResultSchema);

module.exports = UserTestResult;
