const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userTestResSchema = new Schema(
	{
		userID: {
			type: ObjectId,
			ref: "Admin",
			required: true,
		},
		testID: {
			type: ObjectId,
			ref: "Test",
			required: true,
		},
		attemptedQues: {
			type: Number,
			default: 0,
		},
		correctQues: {
			type: Number,
			default: 0,
		},
		wrongQues: {
			type: Number,
			default: 0,
		},
		rank: {
			type: Number,
			default: 0,
		},
		accuracy: {
			type: Number,
			default: 0,
		},
		percentile: {
			type: Number,
			default: 0,
		},
		timeleft: {
			type: Number,
			default: 0,
		},
		remainingQues: {
			type: Number,
			default: 0,
		},
		userMarks: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			default: "inprogress",
			enum: ["inprogress", "finished"],
		},
	},
	{
		timestamps: true,
	}
);

const UserTestRes = model("UserTestRes", userTestResSchema);
module.exports = UserTestRes;
