const mongoose = require("mongoose");

const { Schema } = mongoose;

const subCategories = new Schema(
	{
		nameSubCategory: {
			type: String,
			required: true,
		},
		descriptionSubCategory: {
			type: String,
			required: true,
		},
		imageLogo: {
			type: String,
			default: "",
		},
		categoryID: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const subCategory = mongoose.model("subCategory", subCategories);

exports.subCategory = subCategory;
