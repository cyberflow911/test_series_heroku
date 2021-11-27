const mongoose = require("mongoose");
const UserQuesRes = require("./UserQuesRes");

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

Questions.virtual("userRes", {
	localField: "_id",
	foreignField: "questionID",
	ref: "UserQuesRes",
});

Questions.methods.getUserRes = async function (userID) {
	const question = this;
	const quesRes = await UserQuesRes.findOne({
		userID,
		questionID: question._id,
	});
	return quesRes;
};

Questions.set("toObject", { virtuals: true });
Questions.set("toJSON", { virtuals: true });
const Question = mongoose.model("Question", Questions);

exports.Question = Question;
