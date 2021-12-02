const mongoose = require("mongoose");
const UserTestRes = require("./UserTestRes");

const { Schema } = mongoose;

const Tests = new Schema(
	{
		name: {
			required: true,
			type: String,
			min: 3,
		},
		description: {
			required: true,
			type: String,
			min: 3,
		},
		price: {
			type: Number,
			default: 0,
		},
		language: {
			type: String,
			enum: ["Hindi", "English"],
			default: "English",
		},
		subCategoryID: {
			type: Schema.Types.ObjectId,
			ref: "subCategory",
			required: true,
		},
		minimumMarks: {
			type: Number,
			default: 0,
		},
		selectedDate: {
			type: String,
			default: "",
		},
		QuestionCount: {
			type: Number,
			default: 0,
		},
		selectedTime: {
			type: String,
			default: "",
		},
		testType: {
			type: String,
			enum: ["Practice", "Test"],
			default: "Practice",
		},
		negativeMarking: {
			type: Number,
			default: 0,
		},
		correctAnswerMarking: {
			type: Number,
			default: 0,
		},
		totalMarks: {
			type: Number,
			default: 0,
		},
		duration: {
			type: String,
			required: true,
		},
		mainContentEnglish: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Section",
				required: true,
			},
		],
		mainContentHindi: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Section",
				required: true,
			},
		],
		mainContent: [
			{
				type: Schema.Types.ObjectId,
				ref: "Question",
			},
		],

		paidStatus: {
			type: Boolean,
			default: false,
		},
		subjectID: {
			type: Schema.Types.ObjectId,
			ref: "Subjects",
		},
		testAttempt: {
			type: Number,
		},
		general: {
			type: String,
		},
		sc: {
			type: String,
		},
		st: {
			type: String,
		},
		ews: {
			type: String,
		},
		km: {
			type: String,
		},
		pwd: {
			type: String,
		},
		obc: {
			type: String,
		},
	},
	{ timestamps: true }
);

Tests.methods.getUserRes = async function (userID) {
	const test = this;
	const testRes = await UserTestRes.findOne({
		userID,
		testID: test._id,
	});
	return testRes;
};

Tests.set("toObject", { virtuals: true });
Tests.set("toJSON", { virtuals: true });
const Test = mongoose.model("Test", Tests);

exports.Test = Test;

// {
//     questionData:

//     {
//         inputType:
//         {
//             type: String,
//             default: 'Text'
//         },
//         question:
//         {
//             type: String,
//             default: ''
//         }
//     },
//     options:
//     {
//         optionType: String,
//         option1:
//         {
//             type: String
//         },
//         option2:
//         {
//             type: String
//         },
//         option3:
//         {
//             type: String
//         },
//         option4:
//         {
//             type: String
//         }

//     }

//     ,
//     answerData:

//     {
//         inputType:
//         {
//             type: String,
//             default: 'Text'
//         },
//         answer:
//         {
//             type: String,
//             default: ''
//         }
//     }

// }
