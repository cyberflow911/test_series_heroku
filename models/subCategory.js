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
    price: {
      type: Number,
      default: 0,
    },
    categoryID: {
      type: String,
      required: true,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subjects",
      },
    ],
    tests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
  },
  { timestamps: true }
);

const subCategory = mongoose.model("subCategory", subCategories);

exports.subCategory = subCategory;
