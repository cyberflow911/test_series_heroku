const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserTestResultSectionSchema = new Schema(
	{
        sectionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true,
        },
        correctQues: Number,
        wrongQues: Number,
        markedQues:Number,
        remaining: Number,
        questions:
        [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "UserTestQuestionResult",
                unique: true,    
            }
        ]	 
		 
	},
	{
		timestamps: true,
	}
);

const UserTestResultSectionSchema = model("UserTestSectionResult", UserTestResultSectionSchema);

module.exports = UserTestResultSectionSchema;
