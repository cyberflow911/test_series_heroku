const mongoose = require("mongoose");

const { Schema } = mongoose;

const Categories = new Schema(
	{
		nameCategory: {
			type: String,
			required: true,
			minlength: 3,
			unique: true,
		},
		subCategory: [
			{
				type: Schema.Types.ObjectId,
				ref: "subCategory",
			},
		],
		
        image:
        {
            type: String,
            default: ''
        },
		descriptionCategory: {
			type: String,
			required: true,
			minlength: 5,
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tag",
			},
		],
	},
	{ timestamps: true }
);

const Category = mongoose.model("Category", Categories);

exports.Category = Category;
