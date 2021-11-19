const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const visitedSectionSchema = new Schema(
	{
		sectionID: {
			type: Schema.Types.ObjectId,
			ref: "Section",
		},
		questions: [
			{
				type: Schema.Types.ObjectId,
				ref: "VisitedQuestion",
			},
		],
	},
	{
		timestamps: true,
	}
);

const VisitedSection = model("VisitedSection", visitedSectionSchema);

module.exports = VisitedSection;
