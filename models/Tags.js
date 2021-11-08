const mongoose = require("mongoose");

const { Schema } = mongoose;

const Tags = new Schema(
	{
		tagName: {
			type: String,
			default: "",
		},
		tagImage: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const Tag = mongoose.model("Tag", Tags);

exports.Tag = Tag;
