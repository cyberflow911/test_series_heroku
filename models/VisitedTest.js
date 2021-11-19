const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const visitedTestSchema = new Schema(
	{
		userID: {
			type: Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
		testID: {
			type: Schema.Types.ObjectId,
			ref: "Test",
			required: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const VisitedTest = model("VisitedTest", visitedTestSchema);

module.exports = VisitedTest;
