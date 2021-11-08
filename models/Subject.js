const mongoose = require("mongoose");

const { Schema } = mongoose;

const Subjects = new Schema(
	{
		subjectName: {
			type: String,
			default: "",
		},
		tests: [
			{
				type: Schema.Types.ObjectId,
				ref: "Test",
			},
		],
	},
	{ timestamps: true }
);

const Subject = mongoose.model("Subjects", Subjects);

exports.Subject = Subject;
