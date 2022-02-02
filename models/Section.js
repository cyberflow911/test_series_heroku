const mongoose = require("mongoose");
const UserSectionRes = require("./UserSectionRes");
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
    },
  ],
});

sectionSchema.methods.getUserRes = async function (userID) {
  const section = this;
  const sectionRes = await UserSectionRes.findOne({
    userID,
    sectionID: section._id,
  });
  return sectionRes;
};

const Section = model("Section", sectionSchema);

module.exports = Section;
