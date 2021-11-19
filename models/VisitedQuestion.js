const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const visitedQuestionSchema = new Schema(
	{
		userID: {
			type: Schema.Types.ObjectId,
			ref: "Admin",
		},
		sectionID: {
			type: Schema.Types.ObjectId,
			ref: "Section",
		},
		questionID: {
			type: Schema.Types.ObjectId,
			ref: "Question",
		},
		answered: {
			type: Boolean,
			default: false,
		},
		selectedOption: {
			type: String,
		},
		visited: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const VisitedQuestion = model("VisitedQuestion", visitedQuestionSchema);

module.exports = VisitedQuestion;
