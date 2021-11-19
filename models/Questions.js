const mongoose = require("mongoose");

const { Schema } = mongoose;

const Questions = new Schema(
	{
		testID: {
			type: String,
			default: "",
		},
		question: {
			type: String,
			default: "",
		},
		optionFormat: {
			type: String,
			enum: ["Text", "File"],
			default: "Text",
		},
		options: [
			{
				optionType: {
					type: String,
				},
				option: {
					type: String,
				},
			},
		],
		answer: {
			type: String,
			default: "",
		},
		answerExplanation: {
			type: String,
			default: "",
		},
		sectionID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
			required: true,
		},
	},
	{ timestamps: true }
);

const Question = mongoose.model("Question", Questions);

exports.Question = Question;
