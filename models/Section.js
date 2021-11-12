const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sectionSchema = new Schema({
	sectionName: {
		type: String,
		required: true,
	},
	questions: [
		{
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Question",
			unique: true,
		},
	],
});

const Section = model("Section", sectionSchema);

module.exports = Section;
