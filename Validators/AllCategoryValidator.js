const Joi = require("joi");

module.exports = (checks, data) => {
	let check = {};
	let checkList = {
		nameCategory: Joi.string().min(3).required(),
		descriptionCategory: Joi.string().min(8).required(),
		nameSubCategory: Joi.string().min(3).required(),
		descriptionSubCategory: Joi.string().min(8).required(),
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
