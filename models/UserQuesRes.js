const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userQuesResSchema = new Schema(
	{
		userID: {
			type: ObjectId,
			ref: "Admin",
			required: true,
		},
		questionID: {
			type: ObjectId,
			ref: "Question",
			required: true,
		},
		sectionID: {
			type: ObjectId,
			ref: "Section",
			required: true,
		},
		status: {
			type: String,
			default: undefined,
		},
		isAttempted: {
			type: Boolean,
			default: false,
		},
		userResponse: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const UserQuesRes = model("UserQuesRes", userQuesResSchema);
module.exports = UserQuesRes;
