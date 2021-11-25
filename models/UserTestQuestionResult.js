const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserTestQuestionResult = new Schema(
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
	},
	{
                timestamps: true,
	}
);

const UserTestQuestionResult = model("UserTestQuestionResult", UserTestQuestionResult);

module.exports = UserTestQuestionResult;
