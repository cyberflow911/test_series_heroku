const mongoose = require("mongoose");

const { Schema } = mongoose;

const Subjects = new Schema(
	{
		subjectName: {
			type: String,
			default: "",
			required: true,
		},
		subCategoryID: {
			type: Schema.Types.ObjectId,
			ref: "subCategory",
		},
	},
	{ timestamps: true }
);

const Subject = mongoose.model("Subjects", Subjects);

exports.Subject = Subject;
