const Joi = require("joi");

module.exports = (checks, data) => {
	let check = {};
	let checkList = {
		name: Joi.string().min(3).required(),
		description: Joi.string().min(8).required(),
		question: Joi.string().min(6).required(),
		answer: Joi.string().min(6).required(),
		negativeMarking: Joi.number(),
		correctAnswerMarking: Joi.number(),
		totalMarks: Joi.number(),
		selectedTime: Joi.string(),
		selectedDate: Joi.string(),
		testType: Joi.string().valid("Practice", "Test"),
		minimumMarks: Joi.number(),
		optionType: Joi.string().valid("Text", "File"),
		subjectID: Joi.string(),
	};

	checks.split(" ").forEach((key) => {
		let trimmedKey = key.trim();

		if (trimmedKey && checkList[trimmedKey]) {
			check[`${trimmedKey}`] = checkList[`${trimmedKey}`];
		}
	});

	const schema = Joi.object(check);

	const { error } = schema.validate(data);

	if (error) {
		return false;
	}
	return true;
};
