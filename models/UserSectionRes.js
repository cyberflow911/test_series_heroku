const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userSectionResSchema = new Schema({
	userID: {
		type: ObjectId,
		ref: "Admin",
		required: true,
	},
	sectionID: {
		type: ObjectId,
		ref: "Section",
		required: true,
	},
	correctQues: {
		type: Number,
		default: 0,
	},
	wrongQues: {
		type: Number,
		default: 0,
	},
	attemptedQues: {
		type: Number,
		default: 0,
	},
	remainingQues: {
		type: Number,
		default: 0,
	},
}, {
  timestamps: true
});

const UserSectionRes = model("UserSectionRes", userSectionResSchema);
module.exports = UserSectionRes;
