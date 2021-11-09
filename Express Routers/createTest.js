const express = require("express");

const router = express.Router();

const testValidator = require("../Validators/testValidator");
const { Test } = require("../models/Test");

const upload = require("../middlewares/multer");
const { Question } = require("../models/Questions");

const fs = require("fs");
const AllCategoryValidator = require("../Validators/AllCategoryValidator");
const { Category } = require("../models/Category");
const { subCategory } = require("../models/subCategory");
const e = require("express");
const request = require("request");

router.post("/createTest/:subCategoryID", async (req, res) => {
	var negative = 0;
	const {
		name,
		description,
		negativeMarking,
		correctAnswerMarking,
		totalMarks,
		duration,
		selectedDate,
		selectedTime,
		testType,
		minimumMarks,
		language,
		price,
	} = req.body;
	const data = {
		name,
		description,
		negativeMarking,
		correctAnswerMarking,
		totalMarks,
		selectedDate,
		selectedTime,
		testType,
	};
	if (negativeMarking) {
		negative = negativeMarking;
	} else {
		negative = 0;
	}

	const resultFromJoi = testValidator(
		"name description negativeMarking correctAnswerMarking totalMarks selectedDate selectedTime testType minimumMarks",
		data
	);
	console.log(data);

	if (!resultFromJoi) {
		res.status(200).json({
			status: false,
			message: "Validation Error!!",
			name: "min 3 Characters",
			description: "min 8 characters",
			negativeMarking: "number value is exprected",
			duration: "String Value is expected",
			correctAnswerMarking: "Number value is exprected",
			selectedDate: "Must Be String Value",
			selectedTime: "Must Be String",
			testType: "Must be enum Value as Practice or Test",
			QuestionCount: 0,
			minimumMarks: minimumMarks,
		});
	} else {
		try {
			const test = await new Test({
				name: name,
				description: description,
				subCategoryID: req.params.subCategoryID,
				negativeMarking: negative,
				duration: duration,
				correctAnswerMarking: correctAnswerMarking,
				totalMarks: totalMarks,
				selectedDate: selectedDate,
				selectedTime: selectedTime,
				testType: testType,
				minimumMarks: minimumMarks,
				language: language,
				price: price,
			});

			if (!test) {
				res.status(200).json({
					status: false,
					message: "Unable to Create Test!!",
				});
			} else {
				await test.save();

				res.status(200).json({
					status: true,
					message: "Created The test!!",
					test: test,
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
});

router.get(
	"/getTestBySubCategory/:subCategoryID/:offset/:limit",
	async (req, res) => {
		const limit = parseInt(req.params.limit);
		const offset = (parseInt(req.params.offset) - 1) * limit;
		try {
			const test = await Test.find(
				{ subCategoryID: req.params.subCategoryID },
				{},
				{
					sort: {
						createdAt: -1,
					},
				}
			)
				.limit(limit)
				.skip(offset);

			if (!test) {
				res.status(200).json({
					status: false,
					message: "Test Not Found",
				});
			} else {
				res.status(200).json({
					status: false,
					message: "Test Found!!",
					test: test,
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
);

router.get("/getQuestions/:testID/:offset/:limit", async (req, res) => {
	const limit = parseInt(req.params.limit);
	const offset = (parseInt(req.params.offset) - 1) * limit;
	try {
		const question = await Question.find(
			{ testID: req.params.testID },
			{},
			{
				sort: {
					createdAt: 1,
				},
			}
		)
			.limit(limit)
			.skip(offset);

		if (!question) {
			res.status(200).json({
				status: false,
				message: "Question Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Questions Found",
				questions: question,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.post("/uploadFile", upload.single("upload"), async (req, res) => {
	console.log(req.file);
	if (!req.file) {
		res.status(200).json({
			uploaded: false,
			message: "File Not Present",
		});
	} else {
		res.status(200).json({
			uploaded: true,
			path: __dirname + "/" + req.file.path,
		});
	}
});

router.delete("/deleteQuestion/:questionID", async (req, res) => {
	try {
		const question = await Question.findOne({ _id: req.params.questionID });
		if (!question) {
			res.status(200).json({
				status: false,
				message: "Question Not Found",
			});
		} else {
			const deleteQuestion = await Question.findOneAndDelete({
				_id: req.params.questionID,
			});
			if (!deleteQuestion) {
				res.status(200).json({
					status: false,
					message: "QUestion is not deleted",
				});
			} else {
				res.status(200).json({
					status: false,
					message: "Question is deleted Successfully",
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
});

router.get("/getQuestionByID/:questionID", async (req, res) => {
	try {
		const question = await Question.findOne({ _id: req.params.questionID });
		if (!question) {
			res.status(200).json({
				status: false,
				message: "Question not found",
			});
		} else {
			res.status(200).json({
				status: true,
				question: question,
			});
		}
	} catch (error) {
		console.log(error);
	}
});
router.get("/getTest/:testID/:language", async (req, res) => {
	if (req.params.language === "English") {
		try {
			const test = await Test.findOne({ _id: req.params.testID }).populate(
				"mainContentEnglish"
			);

			if (!test) {
				res.status(200).json({
					status: false,
					message: "Test not Found",
				});
			} else {
				res.status(200).json({
					status: true,
					test: test,
				});
			}
		} catch (error) {
			console.log(error);
		}
	} else {
		try {
			const test = await Test.findOne({ _id: req.params.testID }).populate(
				"mainContentHindi"
			);

			if (!test) {
				res.status(200).json({
					status: false,
					message: "Test not Found",
				});
			} else {
				res.status(200).json({
					status: true,
					test: test,
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
});

//this is testing route to get all the tests
router.get("/getAllTest", async (req, res) => {
	try {
		const tests = await Test.find();
		res.json(tests);
	} catch (error) {
		console.log(error);
	}
});

// get tests by test id and language populate with pagination
router.get("/getTest/:testID", async (req, res) => {
	const { limit, offset, language } = req.query;

	const limitQues = parseInt(limit) || 10;
	const skipQues = (parseInt(offset) - 1) * limitQues || 1;

	let languageQues;
	if (!language) {
		res.status(500).json({
			status: false,
			message: "Please provide language (hindi/english)",
		});
	} else {
		if (language.toLowerCase() === "english") {
			languageQues = "mainContentEnglish";
		} else if (language.toLowerCase() === "hindi") {
			languageQues = "mainContentHindi";
		}
	}

	try {
		const test = await Test.findOne({ _id: req.params.testID }).populate([
			{
				path: languageQues,
				options: { limit: limitQues, skip: skipQues, createdAt: -1 },
			},
		]);
		if (!test) {
			res.status(200).json({
				status: false,
				message: "Test not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				test: test,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

// router.get(
// 	"/getTest/:testID/:language/:limitQuestion/:offsetQuestion",
// 	async (req, res) => {
// 		const limitQuestion = parseInt(req.params.limitQuestion);
// 		const offset = parseInt(req.params.offsetQuestion - 1) * limitQuestion;
// 		console.log(offset);
// 		console.log(limitQuestion);

// 		if (req.params.language === "English") {
// 			try {
// 				const test = await Test.findOne({ _id: req.params.testID }).populate([
// 					{
// 						path: "mainContentEnglish",
// 						options: {
// 							limit: limitQuestion,
// 							skip: offset,
// 						},
// 					},
// 				]);

// 				if (!test) {
// 					res.status(200).json({
// 						status: false,
// 						message: "Test not Found",
// 					});
// 				} else {
// 					res.status(200).json({
// 						status: true,
// 						test: test,
// 					});
// 				}
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		} else {
// 			try {
// 				const test = await Test.findOne({ _id: req.params.testID }).populate([
// 					{
// 						path: "mainContentHindi",
// 						options: {
// 							skip: offset,
// 							limit: limitQuestion,
// 						},
// 					},
// 				]);

// 				if (!test) {
// 					res.status(200).json({
// 						status: false,
// 						message: "Test not Found",
// 					});
// 				} else {
// 					res.status(200).json({
// 						status: true,
// 						test: test,
// 					});
// 				}
// 			} catch (error) {
// 				console.log(error);
// 			}
// 		}
// 	}
// );

//api to post array questions where options are text
router.post(
	"/testArrayTextOptions",
	upload.fields([
		{
			name: "questionImage",
		},
	]),
	async (req, res) => {
		for (let i = 0; i < req.body.length; i++) {
			if (req.body[i].optionType === "Text") {
				const newQuestion = await new Question({
					question: req.body[i].question,
					answer: req.body[i].answer,
					answerExplanation: req.body[i].answerExplanation,
					optionFormat: req.body[i].optionFormat,
				});

				if (!newQuestion) {
					res.status(500).json({
						status: false,
						message: "Question is not Created",
					});
				} else {
					await newQuestion.save();
					console.log("Question is Added");
					req.body[i].options.forEach(async (optionValue) => {
						const updateQuestion = await Question.updateMany(
							{ _id: newQuestion._id },
							{
								$push: {
									options: {
										option: optionValue.option,
									},
								},
							}
						);
					});
				}
			}
		}

		res.status(200).json({
			status: true,
			message: "Question Added",
		});

		// req.body.forEach(async (element) => {
		//     console.log(element);

		// });
	}
);
router.post("/testArrayTextOptions/:testID/:language", async (req, res) => {
	try {
		const testID = await Test.findOne({ _id: req.params.testID });
		if (!testID) {
			res.status(200).json({
				status: false,
				message: "Test Not Found",
			});
		} else {
			if (req.params.language === "English") {
				for (let i = 0; i < req.body.length; i++) {
					if (req.body[i].optionType === "Text") {
						const newQuestion = await new Question({
							question: req.body[i].question,
							answer: req.body[i].answer,
							answerExplanation: req.body[i].answerExplanation,
							optionFormat: req.body[i].optionFormat,
						});

						if (!newQuestion) {
							res.status(500).json({
								status: false,
								message: "Question is not Created",
							});
						} else {
							await newQuestion.save();
							console.log("Question is Added");
							req.body[i].options.forEach(async (optionValue) => {
								const updateQuestion = await Question.updateMany(
									{ _id: newQuestion._id },
									{
										$push: {
											options: {
												option: optionValue.option,
											},
										},
									}
								);

								const updateTest = await Test.updateMany();
							});

							const user = await Test.updateMany(
								{ _id: req.params.testID },
								{
									$push: {
										mainContentEnglish: newQuestion._id,
									},
								}
							);
						}
					}
				}

				res.status(200).json({
					status: true,
					message: "Question Added",
				});
			} else {
				for (let i = 0; i < req.body.length; i++) {
					if (req.body[i].optionType === "Text") {
						const newQuestion = await new Question({
							question: req.body[i].question,
							answer: req.body[i].answer,
							answerExplanation: req.body[i].answerExplanation,
							optionFormat: req.body[i].optionFormat,
						});

						if (!newQuestion) {
							res.status(500).json({
								status: false,
								message: "Question is not Created",
							});
						} else {
							await newQuestion.save();
							console.log("Question is Added");
							req.body[i].options.forEach(async (optionValue) => {
								const updateQuestion = await Question.updateMany(
									{ _id: newQuestion._id },
									{
										$push: {
											options: {
												option: optionValue.option,
											},
										},
									}
								);

								const updateTest = await Test.updateMany();
							});
							console.log("Hello world");

							const user = await Test.updateMany(
								{ _id: req.params.testID },
								{
									$push: {
										mainContentHindi: newQuestion._id,
									},
								}
							);
						}
					}
				}

				res.status(200).json({
					status: true,
					message: "Question Added",
				});
			}
		}
	} catch (error) {
		console.log(error);
	}

	// req.body.forEach(async (element) => {
	//     console.log(element);

	// });
});

router.post(
	"/testArray",
	upload.fields([
		{
			name: "questionImage",
			maxCount: 5,
		},
		{
			name: "optionsImage",
		},
	]),
	async (req, res) => {
		var optionCount = 0;
		const questionCount = 0;
		req.body.forEach(async (element) => {
			if (element.questionType === "File" && element.optionFormat === "Text") {
				try {
					const questionAdd = await new Question({
						question: req.files.questionImage[questionCount].path,
						answer: element.answer,
						answerExplanation: element.answerExplanation,
						optionFormat: element.optionFormat,
					});
					if (!questionAdd) {
						res.status(500).json({
							status: false,
							message: "Question Not Added",
						});
					} else {
						addQuestion.save();
						questionCount++;
					}
				} catch (error) {
					console.log(error);
				}
			}
		});
	}
);

router.post("editTest/:testID", async (req, res) => {
	const test = await Test.findOne({ _id: req.params.testID });
	if (!test) {
		res.status(200).json({
			status: false,
			message: "Test not Found",
		});
	} else {
	}
});

router.post(
	"/postQuestion/:testID",
	upload.fields([
		{
			name: "questionImage",
			maxCount: 1,
		},
		{
			name: "answerImage",
			maxCount: 1,
		},
		{
			name: "optionsImage",
			maxCount: 9,
		},
	]),
	async (req, res) => {
		console.log(req.files);
		var finalQuestion = "";
		var finalAnswer = "";
		var inputTypeQuestion = "";
		var inputTypeAnswer = "";
		const { question, answer, answerExplaination, optionFormat } = req.body;

		//checking testID
		try {
			const test = await Test.findOne({ _id: req.params.testID });
			if (!test) {
				res.status(200).json({
					status: false,
					message: "Test Not Found",
				});
			} else {
				if (!question) {
					if (!req.files.questionImage[0].path) {
						res.status(200).json({
							status: false,
							message: "Input not found For Question",
						});
					} else {
						finalQuestion = req.files.questionImage[0].path;
						inputTypeQuestion = "FILE";
					}
				} else {
					finalQuestion = question;
					inputTypeQuestion = "TEXT";
				}

				//Getting all the Answers fromt the test

				if (!answer) {
					if (!req.files.answerImage[0].path) {
						res.status(200).json({
							status: false,
							message: "No Input Provided for the Answer Field",
						});
					} else {
						finalAnswer = req.files.answerImage[0].path;
						inputTypeAnswer = "FILE";
					}
				} else {
					finalAnswer = answer;
					inputTypeAnswer = "TEXT";
				}

				//Writing the Data in the Database

				const addQuestion = await new Question({
					questionData: {
						inputType: inputTypeQuestion,
						question: finalQuestion,
					},
					answerData: {
						inputType: inputTypeAnswer,
						answer: finalAnswer,
						answerExplaination: answerExplaination,
					},
					testID: req.params.testID,
				});

				if (!addQuestion) {
					res.status(200).json({
						status: false,
						message: "Question is not Added",
					});
				} else {
					await addQuestion.save();
					if (optionFormat === "Text") {
						try {
							req.body.options.forEach(async (element) => {
								console.log(element);
								const addOption = await Question.updateMany(
									{ _id: addQuestion._id },
									{
										$push: {
											options: {
												optionType: "Text",
												option: element,
											},
										},
									}
								);
							});
						} catch (error) {
							console.log(error);
						}
					} else {
						req.files.optionsImage.forEach(async (element, index) => {
							console.log("Hello world");
							console.log(index);
							console.log(element);
							const data = {
								optionType: "File",
								option: element.path,
							};

							const updateOption = await Question.updateMany(
								{ _id: addQuestion._id },
								{
									$push: {
										options: data,
									},
								}
							);
						});
					}

					const test = await Test.findOneAndUpdate(
						{
							_id: req.params.testID,
						},
						{
							$push: {
								mainContent: addQuestion._id,
							},
						}
					);

					res.status(200).json({
						status: true,
						message: "Question Is Added Sucessfully",
						id: addQuestion._id,
					});
				}
			}
		} catch (error) {
			console.log(error);
		}

		//Getting the Questions
	}
);

// router.post('/testAddQuestion/:testID', async (req,res)=>
// {
//     const {question, answer, answerExplanation, optionFormat} = req.body;

//     const addQuestion = await new Question(req.body);
//      if(!addQuestion)
//      {
//          res.status(200).json(
//              {
//                  status: false,
//                  message: "Question is not added!!"
//              }
//          )
//      }
//      else
//      {
//          res.status(200).json(
//              {
//                  status: true,
//                  message: "Question is added Succesfully"
//              }
//          )
//      }

// })

router.post("/testAddQuestion/:testID", async (req, res) => {
	try {
		const testFind = await Test.findOne({ _id: req.params.testID });
		if (!testFind) {
			res.status(200).json({
				status: false,
				message: "Test Not Found",
			});
		} else {
			const addQuestion = await new Question(req.body);

			if (!addQuestion) {
				res.status(200).json({
					status: false,
					message: "User not Found",
				});
			} else {
				await addQuestion.save();
				try {
					const updateTest = await Test.updateMany(
						{ _id: req.params.testID },
						{
							$push: {
								mainContent: addQuestion._id,
							},
						}
					);
				} catch (error) {
					console.log(error);
				}
				res.status(200).json({
					status: true,
					message: "Question is Added Successfuly",
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
});

router.post(
	"/addQuestion",
	upload.fields([
		{
			name: "questionImage",
			maxCount: 1,
		},
		{
			name: "answerImage",
			maxCount: 1,
		},
		{
			name: "optionsImage",
			maxCount: 9,
		},
	]),
	async (req, res) => {
		console.log(req.files);
		var finalQuestion = "";
		var finalAnswer = "";
		var inputTypeQuestion = "";
		var inputTypeAnswer = "";
		const { question, answer, answerExplaination, optionFormat } = req.body;

		//checking testID
		try {
			if (!question) {
				if (!req.files.questionImage[0].path) {
					res.status(200).json({
						status: false,
						message: "Input not found For Question",
					});
				} else {
					finalQuestion = req.files.questionImage[0].path;
					inputTypeQuestion = "FILE";
				}
			} else {
				finalQuestion = question;
				inputTypeQuestion = "TEXT";
			}

			//Getting all the Answers fromt the test

			if (!answer) {
				if (!req.files.answerImage[0].path) {
					res.status(200).json({
						status: false,
						message: "No Input Provided for the Answer Field",
					});
				} else {
					finalAnswer = req.files.answerImage[0].path;
					inputTypeAnswer = "FILE";
				}
			} else {
				finalAnswer = answer;
				inputTypeAnswer = "TEXT";
			}

			//Writing the Data in the Database

			const addQuestion = await new Question({
				questionData: {
					inputType: inputTypeQuestion,
					question: finalQuestion,
				},
				answerData: {
					inputType: inputTypeAnswer,
					answer: finalAnswer,
					answerExplaination: answerExplaination,
				},
				testID: req.params.testID,
			});

			if (!addQuestion) {
				res.status(200).json({
					status: false,
					message: "Question is not Added",
				});
			} else {
				await addQuestion.save();
				if (optionFormat === "Text") {
					try {
						req.body.options.forEach(async (element) => {
							console.log(element);
							const addOption = await Question.updateMany(
								{ _id: addQuestion._id },
								{
									$push: {
										options: {
											optionType: "Text",
											option: element,
										},
									},
								}
							);
						});
					} catch (error) {
						console.log(error);
					}
				} else {
					req.files.optionsImage.forEach(async (element, index) => {
						console.log("Hello world");
						console.log(index);
						console.log(element);
						const data = {
							optionType: "File",
							option: element.path,
						};

						const updateOption = await Question.updateMany(
							{ _id: addQuestion._id },
							{
								$push: {
									options: data,
								},
							}
						);
					});
				}

				res.status(200).json({
					status: true,
					message: "Question Is Added Sucessfully",
					id: addQuestion._id,
				});
			}
		} catch (error) {
			console.log(error);
		}

		//Getting the Questions
	}
);

router.post(
	"/addQuestion/:question",
	upload.fields([
		{
			name: "questionImage",
			maxCount: 1,
		},
		{
			name: "answerImage",
			maxCount: 1,
		},
		{
			name: "optionsImage",
			maxCount: 9,
		},
	]),
	async (req, res) => {
		console.log(req.files);
		var finalQuestion = "";
		var finalAnswer = "";
		var inputTypeQuestion = "";
		var inputTypeAnswer = "";
		const { question, answer, answerExplaination, optionFormat } = req.body;

		//checking testID
		try {
			const questionImage = await Question.findOne({
				_id: req.params.questionID,
			});
			if (!questionImage) {
				res.status(200).json({
					status: false,
					message: "Question Not found",
				});
			} else {
				if (!question) {
					if (!req.files.questionImage[0].path) {
						res.status(200).json({
							status: false,
							message: "Input not found For Question",
						});
					} else {
						try {
							fs.unlinkSync(questionImage.questionData);
						} catch (error) {
							res.status(400).json({
								message: errror.message,
							});
						}
						finalQuestion = req.files.questionImage[0].path;
						inputTypeQuestion = "FILE";
					}
				} else {
					finalQuestion = question;
					inputTypeQuestion = "TEXT";
				}

				//Getting all the Answers fromt the test

				if (!answer) {
					if (!req.files.answerImage[0].path) {
						res.status(200).json({
							status: false,
							message: "No Input Provided for the Answer Field",
						});
					} else {
						finalAnswer = req.files.answerImage[0].path;
						inputTypeAnswer = "FILE";
					}
				} else {
					finalAnswer = answer;
					inputTypeAnswer = "TEXT";
				}

				//Writing the Data in the Database

				const addQuestion = await new Question({
					questionData: {
						inputType: inputTypeQuestion,
						question: finalQuestion,
					},
					answerData: {
						inputType: inputTypeAnswer,
						answer: finalAnswer,
						answerExplaination: answerExplaination,
					},
					testID: req.params.testID,
				});

				if (!addQuestion) {
					res.status(200).json({
						status: false,
						message: "Question is not Added",
					});
				} else {
					await addQuestion.save();
					if (optionFormat === "Text") {
						try {
							req.body.options.forEach(async (element) => {
								console.log(element);
								const addOption = await Question.updateMany(
									{ _id: addQuestion._id },
									{
										$push: {
											options: {
												optionType: "Text",
												option: element,
											},
										},
									}
								);
							});
						} catch (error) {
							console.log(error);
						}
					} else {
						req.files.optionsImage.forEach(async (element, index) => {
							console.log("Hello world");
							console.log(index);
							console.log(element);
							const data = {
								optionType: "File",
								option: element.path,
							};

							const updateOption = await Question.updateMany(
								{ _id: addQuestion._id },
								{
									$push: {
										options: data,
									},
								}
							);
						});
					}

					res.status(200).json({
						status: true,
						message: "Question Is Added Sucessfully",
						id: addQuestion._id,
					});
				}
			}
		} catch (error) {
			console.log(error);
		}

		//Getting the Questions
	}
);

router.post(
	"/addQuestionTest",
	upload.fields([
		{
			name: "optionsImage",
			maxCount: 9,
		},
	]),
	async (req, res) => {
		console.log(req.body);

		if (req.body.optionFormat === "File") {
			try {
				const questionImage = await new Question(req.body);
				if (!questionImage) {
					res.status({
						status: false,
						message: "Question not created",
					});
				} else {
					await questionImage.save();

					req.files.optionsImage.forEach(async (element) => {
						const data = {
							optionType: "File",
							option: element.path,
						};
						const updateOptions = await Question.updateMany(
							{ _id: questionImage._id },
							{
								$push: {
									options: data,
								},
							}
						);
					});

					res.status(200).json({
						status: true,
						message: "Question is added successfully",
						id: questionImage._id,
					});
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				const addQuestion = await new Question(req.body);
				if (!addQuestion) {
					res.status(200).json({
						status: false,
						messsage: "Question not Added",
					});
				} else {
					await addQuestion.save();
					res.status(200).json({
						status: true,
						message: "Question is added Successfuly!!",
						id: addQuestion._id,
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	}
);

router.put("/editQuestion/:questionID", async (req, res) => {
	try {
		const questionFind = await Question.findOne({ _id: req.params.questionID });

		if (!questionFind) {
			res.status(200).json({
				status: false,
				message: "Question Not Found",
			});
		} else {
			const updateQuestion = await Question.findOneAndUpdate(
				{ _id: req.params.questionID },
				req.body
			);

			if (!updateQuestion) {
				res.status(200).json({
					status: false,
					message: "Question is not Updated",
				});
			} else {
				res.status(200).json({
					status: true,
					message: `${req.params.questionID} is updated Successfully!!`,
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
});

router.put("/editQuestionData/:questionID", async (req, res) => {
	const { answer, question, answerExplanation, optionFormat } = req.body;
	try {
		const questionFind = await Question.findOne({ _id: req.params.questionID });
		console.log(questionFind);
		if (!questionFind) {
			res.status(200).json({
				status: false,
				message: "Question Not Found",
			});
		} else {
			const questionUpdate = await Question.updateMany(
				{ _id: req.params.questionID },
				{
					answer: answer,
					question: question,
					answerExplanation: answerExplanation,
					optionFormat: optionFormat,
				}
			);

			res.status(200).json({
				status: true,
				message: "Updated Successfully!!",
			});
		}
	} catch (error) {
		console.log(error);
	}
});

// router.post('/getImage', async(req, res)=>
// {

//     const imageURL = req.body;
//     var download = function(uri, filename, callback){
//         request.head(uri, function(err, res, body){
//           console.log('content-type:', res.headers['content-type']);
//           console.log('content-length:', res.headers['content-length']);

//           request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//         });
//       };

//       download('images\1634933240230---WhatsApp Image 2021-10-20 at 22.09.31.jpeg', 'WhatsApp Image 2021-10-20 at 22.09.31.jpeg', function(){
//         console.log('done');
//       });
//     // res.download(req.params.imageURL);

// })

router.put(
	"/editOption/:questionID/:optionsID",
	upload.single("optionsImage"),
	async (req, res) => {
		const { option, optionType } = req.body;
		try {
			console.log(req.file);
			const findQuestion = await Question.findOne(
				{ _id: req.params.questionID },
				{
					options: {
						$elemMatch: {
							_id: req.params.optionsID,
						},
					},
				}
			);
			console.log(findQuestion);
			if (!findQuestion) {
				res.status(200).json({
					status: false,
					message: "Option Not Found",
				});
			} else {
				if (optionType === "File") {
					console.log(req.file);
					if (!req.file) {
						// res.status(200).json(
						//     {
						//         status: false,
						//         message: "File Not present"
						//     }
						// )
						const updateOption = await Question.updateMany(
							{
								_id: req.params.questionID,
								"options._id": req.params.optionsID,
							},
							{
								$set: {
									"options.$.option": option,
									"options.$.optionType": "Text",
								},
							}
						);
					} else {
						const updateOption = await Question.updateMany(
							{
								_id: req.params.questionID,
								"options._id": req.params.optionsID,
							},
							{
								$set: {
									"options.$.option": req.file.path,
									"options.$.optionType": "File",
								},
							}
						);

						res.status(200).json({
							status: true,
							message: "Updated Option Successfully",
						});
					}
				} else {
					const updateOption = await Question.updateMany(
						{ _id: req.params.questionID, "options._id": req.params.optionsID },
						{
							$set: {
								"options.$.option": option,
								"options.$.optionType": "Text",
							},
						}
					);

					res.status(200).json({
						status: true,
						message: "Updated Option Successfully",
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
);

//create Other language Test
router.post(
	"/createTest/:subCategoryID/:mainTestID/:language",
	async (req, res) => {
		var negative = 0;
		const {
			name,
			description,
			negativeMarking,
			correctAnswerMarking,
			totalMarks,
			duration,
			selectedDate,
			selectedTime,
			testType,
			minimumMarks,
			QuestionCount,
		} = req.body;
		const data = {
			name,
			description,
			negativeMarking,
			correctAnswerMarking,
			totalMarks,
			selectedDate,
			selectedTime,
			testType,
		};
		if (negativeMarking) {
			negative = negativeMarking;
		} else {
			negative = 0;
		}

		const resultFromJoi = testValidator(
			"name description negativeMarking correctAnswerMarking totalMarks selectedDate selectedTime testType minimumMarks",
			data
		);
		console.log(data);

		if (!resultFromJoi) {
			res.status(200).json({
				status: false,
				message: "Validation Error!!",
				name: "min 3 Characters",
				description: "min 8 characters",
				negativeMarking: "number value is exprected",
				duration: "String Value is expected",
				correctAnswerMarking: "Number value is exprected",
				selectedDate: "Must Be String Value",
				selectedTime: "Must Be String",
				testType: "Must be enum Value as Practice or Test",
				QuestionCount: QuestionCount,
				minimumMarks: minimumMarks,
			});
		} else {
			try {
				const test = await new Test({
					name: name,
					description: description,
					subCategoryID: req.params.subCategoryID,
					negativeMarking: negative,
					duration: duration,
					otherLanguageID: req.params.mainTestID,
					correctAnswerMarking: correctAnswerMarking,
					totalMarks: totalMarks,
					selectedDate: selectedDate,
					selectedTime: selectedTime,
					testType: testType,
					language: req.params.language,
					minimumMarks: minimumMarks,
				});

				if (!test) {
					res.status(200).json({
						status: false,
						message: "Unable to Create Test!!",
					});
				} else {
					await test.save();
					try {
						const testUpdate = await Test.updateOne(
							{ _id: req.params.mainTestID },
							{
								otherLanguageID: test._id,
							}
						);
					} catch (error) {
						console.log(error);
					}

					res.status(200).json({
						status: true,
						message: "Created The test!!",
						test: test,
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	}
);

router.get("/getTestByLanguage/:language", async (req, res) => {
	console.log(req.params.language);
	try {
		const testFind = await Test.find({ language: req.params.language });
		if (!testFind) {
			res.status(200).json({
				status: false,
				message: "Test Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				tests: testFind,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.post(
	"/addQuestionRealTest/:testID",
	upload.fields([
		{
			name: "optionsImage",
			maxCount: 9,
		},
	]),
	async (req, res) => {
		console.log(req.body);

		const testCheck = await Test.findOne({ _id: req.params.testID });
		if (!testCheck) {
			res.status(200).json({
				status: false,
				message: "Test Not found",
			});
		} else {
			if (req.body.optionFormat === "File") {
				try {
					const questionImage = await new Question(req.body);
					if (!questionImage) {
						res.status({
							status: false,
							message: "Question not created",
						});
					} else {
						await questionImage.save();

						req.files.optionsImage.forEach(async (element) => {
							const data = {
								optionType: "File",
								option: element.path,
							};
							const updateOptions = await Question.updateMany(
								{ _id: questionImage._id },
								{
									$push: {
										options: data,
									},
								}
							);
						});

						const testUpdate = await Test.updateMany(
							{ _id: req.params.testID },
							{
								$push: {
									mainContent: questionImage._id,
								},
							}
						);

						res.status(200).json({
							status: true,
							message: "Question is added successfully",
						});
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				try {
					const addQuestion = await new Question(req.body);
					if (!addQuestion) {
						res.status(200).json({
							status: false,
							messsage: "Question not Added",
						});
					} else {
						await addQuestion.save();

						const updateTest = await Test.updateMany(
							{ _id: req.params.testID },
							{
								$push: {
									mainContent: addQuestion._id,
								},
							}
						);
						res.status(200).json({
							status: true,
							message: "Question is added Successfuly!!",
						});
					}
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
);

router.post(
	"/addQuestionTest/:questionID",
	upload.fields([
		{
			name: "optionsImage",
			maxCount: 9,
		},
	]),
	async (req, res) => {
		const addQuestion = await Question.findOne({ _id: req.params.questionID });

		if (!addQuestion) {
			res.status(200).json({
				stattus: false,
				message: "No Question Exists",
			});
		} else {
			if (addQuestion.optionFormat === "File") {
				console.log("Hello world");
				try {
					addQuestion.options.forEach(async (element) => {
						console.log(element);
						try {
							await fs.unlinkSync(element.option);
						} catch (error) {
							console.log(error);
						}
					});

					const setArray = await Question.updateMany(
						{ _id: req.params.questionID },
						{
							$set: {
								options: [],
							},
						}
					);
				} catch (error) {
					res.send(error.message);
				}
			}
		}

		if (!addQuestion) {
			res.status(200).json({
				status: false,
				message: "Question not found",
			});
		} else {
			if (req.body.optionFormat === "File") {
				try {
					const questionImage = await Question.updateMany(
						{ _id: req.params.questionID },
						req.body
					);
					if (!questionImage) {
						res.status({
							status: false,
							message: "Question not created",
						});
					} else {
						req.files.optionsImage.forEach(async (element) => {
							const data = {
								optionType: "File",
								option: element.path,
							};
							console.log(data);
							const updateOptions = await Question.updateMany(
								{ _id: req.params.questionID },
								{
									$push: {
										options: data,
									},
								}
							);
						});

						res.status(200).json({
							status: true,
							message: "Question is added successfully",
						});
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				try {
					const addQuestion = await Question.updateMany(
						{ _id: req.params.questionID },
						req.body
					);
					if (!addQuestion) {
						res.status(200).json({
							status: false,
							messsage: "Question not Added",
						});
					} else {
						res.status(200).json({
							status: true,
							message: "Question is Edited Successfuly!!",
						});
					}
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
);

router.post(
	"/addOptions/:questionID",
	upload.fields([
		{
			name: "optionImage",
			maxCount: 1,
		},
	]),
	async (req, res) => {
		//checking the question in the collection

		try {
			const question = await Question.findOne({ _id: req.params.questionID });
			if (!question) {
				res.status(200).json({
					status: false,
					message: "Question Not Found",
				});
			} else {
				var finalOption = "";
				const { option, optionType } = req.body;
				const data = { optionType };
				const validateOption = await testValidator("optionType", data);
				if (!validateOption) {
					res.status(200).json({
						status: false,
						message: "Validation Error",
					});
				} else {
					if (optionType == "Text") {
						if (!option) {
							res.status(200).json({
								status: false,
								message: "Options not Given",
							});
						}
						{
							finalOption = option;
						}
					} else {
						if (!req.files.optionImage[0].path) {
							res.status(200).json({
								status: false,
								message: "File Not Given",
							});
						} else {
							finalOption = req.files.optionImage[0].path;
						}
					}

					try {
						const data = {
							optionType: optionType,
							option: finalOption,
						};
						const addOption = await Question.updateMany(
							{ _id: req.params.questionID },
							{
								$push: {
									options: data,
								},
							}
						);
						if (!addOption) {
							res.status(200).json({
								status: false,
								message: "Option is not Added",
							});
						} else {
							res.status(200).json({
								status: true,
								message: "Option is added Successfully",
							});
						}
					} catch (error) {
						console.log(error);
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
);

router.post("/addSingleQuestion", async (req, res) => {
	try {
		const addQuestion = await new Question({
			question: req.body.question,
			answer: req.body.answer,
			answerExplanation: req.body.answerExplanation,
			optionType: req.body.optionType,
		});

		if (!addQuestion) {
			res.status(200).json({
				status: false,
				message: "Question not Added",
			});
		} else {
			await addQuestion.save();
			for (i = 0; i < req.body.options.length; i++) {
				const optionData = {
					option: req.body.options[i],
				};
				const updateQuestion = await Question.updateMany(
					{
						_id: addQuestion._id,
					},
					{
						$push: {
							options: optionData,
						},
					}
				);
			}

			res.status(200).json({
				status: false,
				message: "Question is Added Successfully",
			});
		}
	} catch (error) {
		console.log(error);
	}
});
// router.post('/postQuestion/textOption/:testID',upload.fields([
//     {
//         name: 'questionImage', maxCount: 1
//     },
//     {
//         name: 'answerImage', maxCount: 1
//     }
// ]),  async(req,res)=>
// {
//     var questionValue='';
//     var answerValue = '';
//     var questionType = '';
//     var answerType = '';
//     console.log(req.files);

//     const {question, answer, option1, option2, option3, option4,answerExplanation} = req.body;
//     if(!question && !answer)
//     {
//         questionValue = req.files.questionImage[0].path;
//         answerValue = req.files.answerImage[0].path    ;
//         questionType= 'FILE FORMAT';
//         answerType= 'FILE FORMAT';

//     }
//     else if(!question)
//     {
//         questionValue = req.files.questionImage[0].path;
//         answerValue = answer;
//         questionType= 'FILE FORMAT';
//         answerType= 'TEXT FORMAT';

//     }
//     else if(!answer)
//     {
//         questionValue = question;
//         answerValue= req.files.answerImage[0].path
//         questionType= 'TEXT FORMAT';
//         answerType= 'FILE FORMAT';

//     }
//     else
//     {
//         questionValue = question;
//         answerValue= answer
//         questionType= 'TEXT FORMAT';
//         answerType= 'TEXT FORMAT';

//     }

//     //putting the questions inside the database

//     try {
//         const mainData = {
//             questionData:
//             {
//                 inputType: questionType,
//                 question: questionValue

//             },
//             options:
//             {
//                 optionType: "TEXT FORMAT",
//                 option1: option1,
//                 option2: option2,
//                 option3: option3,
//                 option4: option4
//             },
//             answerData:
//             {
//                 inputType: answerType,
//                 answer: answerValue,
//                 answerExplanation: answerExplanation
//             }
//         }
//         const createQuestion = await new Question(mainData);
//         await createQuestion.save();

//         const test = await Test.findOneAndUpdate({
//             _id: req.params.testID
//         },
//         {
//             $push:
//             {
//                 mainContent: createQuestion._id
//             }
//         })

//         res.status(200).json(
//             {
//                 status: true,
//                 message: "Data is added Successfuly!!",
//                 QuestionDetails: mainData
//             }
//         )

//     } catch (error) {

//         console.log(error);
//     }

// })

// router.post('/postQuestion/fileOption/:testID',upload.fields([{
//     name: 'questionImage', maxCount: 1
//   }, {
//     name: 'answerImage', maxCount: 1
//   },
//   {
//     name: 'option1', maxCount: 1

// },
// {
//     name: 'option2', maxCount: 1

// },
// {
//     name: 'option3', maxCount: 1

// },
// {
//     name: 'option4', maxCount: 1

// }]), async(req, res)=>
// {

//     var questionValue='';
//     var answerValue = '';
//     var questionType = '';
//     var answerType = '';
//     console.log(req.files);

//     const {question, answer, answerExplanation} = req.body;

//     if(!question && !answer)
//     {
//         questionValue= req.files.questionImage[0].path;
//         answerValue= req.files.answerImage[0].path ;
//         questionType= 'FILE FORMAT'
//         answerType=  'FILE FORMAT'

//     }
//     else if(!question)
//     {
//         questionValue= req.files.questionImage[0].path;
//         answerValue= answer
//         questionType= 'FILE FORMAT'
//         answerType=  'TEXT FORMAT'

//     }
//     else if(!answer)
//     {
//         questionValue = question;
//         answerValue= req.files.answerImage[0].path
//         questionType= 'TEXT FORMAT'
//         answerType=  'FILE FORMAT'

//     }
//     else
//     {
//         questionValue= question;
//         answerValue= answer
//         questionType= 'TEXT FORMAT'
//         answerType=  'TEXT FORMAT'

//     }

//         try {
//             const mainData = {
//                 questionData:
//                 {
//                     inputType: questionType,
//                     question: questionValue

//                 },
//                 options:
//                 {
//                     optionType: "FILE FORMAT",
//                     option1: req.files.option1[0].path,
//                     option2: req.files.option2[0].path,
//                     option3: req.files.option3[0].path,
//                     option4: req.files.option4[0].path
//                 },
//                 answerData:
//                 {
//                     inputType: answerType,
//                     answer: answerValue,
//                     answerExplanation: answerExplanation
//                 }
//             }
//             const questionCreation = await new Question(mainData);
//             await questionCreation.save();
//             const test = await Test.findOneAndUpdate({_id: req.params.testID}, {
//                 $push:
//                 {
//                     mainContent: questionCreation._id
//                 }
//             })

//             res.status(200).json({
//                 status: true,
//                 message:" Question is added Successfully!!",
//                 data: mainData
//             })

//         } catch (error) {

//             console.log(error);
//         }

// })

//delete need to be fixed --------------------------------------------------------------------------------------------------------------------------------???????????????????????????????____________________

router.delete(
	"/deleteQuestion/:testID/:questionID/:language",
	async (req, res) => {
		try {
			const test = await Test.findOne({ _id: req.params.testID });
			console.log(test);
			if (!test) {
				res.status(200).json({
					status: false,
					message: "Test Not Found",
				});
			} else {
				const question = await Question.findOne({ _id: req.params.questionID });
				console.log(question);
				if (!question) {
					res.status(200).json({
						status: false,
						message: "Question not Found",
					});
				} else {
					if (question.optionFormat === "File") {
						question.options.forEach((element) => {
							try {
								fs.unlinkSync(element.option);
							} catch (error) {
								console.log(error);
							}
						});
					}
					if (req.params.language === "English") {
						try {
							const deleteQuestion = await Test.updateMany(
								{ _id: req.params.testID },
								{
									$pull: {
										mainContentEnglish: {
											_id: req.params.questionID,
										},
									},
								}
							);
							// console.log(`new ObjectId("${req.params.questionID}")`);

							// const arr = test.mainContent.filter(e => e !== `new ObjectId("${req.params.questionID}")`);
							// console.log(arr); // will return ['A', 'C']
							// const testUpdate = await Test.updateMany({_id:req.params.testID},
							//     {
							//         $set:
							//         {
							//             mainContent: arr
							//         }
							//     })
							if (!deleteQuestion) {
								res.status(200).json({
									status: false,
									message: "QUestion is not deleted",
								});
							} else {
								res.status(200).json({
									status: true,
									message: "Questions is deleted Successsfully",
								});
							}
						} catch (error) {
							console.log(error);
						}
					} else {
						try {
							const deleteQuestion = await Test.updateMany(
								{ _id: req.params.testID },
								{
									$pull: {
										mainContentHindi: req.params.questionID,
									},
								}
							);
							// console.log(`new ObjectId("${req.params.questionID}")`);

							// const arr = test.mainContent.filter(e => e !== `new ObjectId("${req.params.questionID}")`);
							// console.log(arr); // will return ['A', 'C']
							// const testUpdate = await Test.updateMany({_id:req.params.testID},
							//     {
							//         $set:
							//         {
							//             mainContent: arr
							//         }
							//     })
							if (!deleteQuestion) {
								res.status(200).json({
									status: false,
									message: "QUestion is not deleted",
								});
							} else {
								res.status(200).json({
									status: true,
									message: "Questions is deleted Successsfully",
								});
							}
						} catch (error) {
							console.log(error);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// router.delete('/deleteQuestion/:testID/:questionID', async(req, res)=>
// {

//     try {

//         const test = await Test.findOne({_id: req.params.testID},
//             {
//                 mainContent:
//                 {
//                     $elemMatch:
//                     {
//                         _id: req.params.questionID
//                     }
//                 }
//             });
//             console.log(test);

//         if(!test)
//         {
//             res.status(200).json(
//                 {
//                     status: false,
//                     message: "Test Not Found!!"
//                 }
//             )
//         }
//         else
//         {
//             try {
//                 console.log(test.mainContent[0].questionData.inputType);

//                 if(test.mainContent[0].options.optionType === 'FILE FORMAT')
//                 {
//                     if(test.mainContent[0].questionData.inputType === 'FILE FORMAT')
//                     {
//                         fs.unlinkSync(test.mainContent[0].questionData.question);

//                     }
//                     if(test.mainContent[0].answerData.inputType === 'FILE FORMAT')
//                     {
//                         fs.unlinkSync(test.mainContent[0].answerData.answer);

//                     }

//                     fs.unlinkSync(test.mainContent[0].options.option1);
//                     fs.unlinkSync(test.mainContent[0].options.option2);
//                     fs.unlinkSync(test.mainContent[0].options.option3);
//                     fs.unlinkSync(test.mainContent[0].options.option4);

//                 }
//                 else
//                 {
//                     console.log(test.mainContent[0].question);
//                     if(test.mainContent[0].questionData.inputType === 'FILE FORMAT')
//                     {
//                         fs.unlinkSync(test.mainContent[0].questionData.question);

//                     }
//                     if(test.answerData.inputType === 'FILE FORMAT')
//                     {
//                         fs.unlinkSync(test.mainContent[0].answerData.answer);

//                     }

//                 }

//             } catch (error) {
//                 console.log("No such files");
//                 console.log(error);

//             }
//             const deleteQuestion = await Test.findOneAndUpdate({_id: req.params.testID}, {
//                 $pull:
//                 {
//                     mainContent:
//                     {
//                         _id: req.params.questionID
//                     }

//                 }
//             })
//             res.status(200).json({
//                 status: true,
//                 message : "Question Deleted Successfuly!!",
//                 testID: req.params.testID,
//                 questionID: req.params.questionID,

//             })

//         }

//     } catch (error) {

//         console.log(error);
//     }

// })

router.get("/getAllQuestions", async (req, res) => {
	try {
		const questions = await Question.find(
			{},
			{},
			{
				sort: {
					createdAt: -1,
				},
			}
		);
		if (!questions) {
			res.status(200).json({
				status: false,
				message: "Questions not Found!",
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Questions found Successfully",
				questions: questions,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

// router.post('/editQuestionFile/:questionID',upload.fields([{
//     name: 'questionImage', maxCount: 1
//   }, {
//     name: 'answerImage', maxCount: 1
//   },
//   {
//     name: 'option1', maxCount: 1

// },
// {
//     name: 'option2', maxCount: 1

// },
// {
//     name: 'option3', maxCount: 1

// },
// {
//     name: 'option4', maxCount: 1

// }]), async( req, res)=>
// {
//     var questionValue='';
//     var answerValue = '';
//     var questionType = '';
//     var answerType = '';
//     console.log(req.files);

//     const {question, answer, answerExplaination} = req.body;

//     if(!question && !answer)
//     {
//         questionValue= req.files.questionImage[0].path;
//         answerValue= req.files.answerImage[0].path ;
//         questionType= 'FILE FORMAT'
//         answerType=  'FILE FORMAT'

//     }
//     else if(!question)
//     {
//         questionValue= req.files.questionImage[0].path;
//         answerValue= answer
//         questionType= 'FILE FORMAT'
//         answerType=  'TEXT FORMAT'

//     }
//     else if(!answer)
//     {
//         questionValue = question;
//         answerValue= req.files.answerImage[0].path
//         questionType= 'TEXT FORMAT'
//         answerType=  'FILE FORMAT'

//     }
//     else
//     {
//         questionValue= question;
//         answerValue= answer
//         questionType= 'TEXT FORMAT'
//         answerType=  'TEXT FORMAT'

//     }

//         try {
//             const mainData = {
//                 questionData:
//                 {
//                     inputType: questionType,
//                     question: questionValue

//                 },
//                 options:
//                 {
//                     optionType: "FILE FORMAT",
//                     option1: req.files.option1[0].path,
//                     option2: req.files.option2[0].path,
//                     option3: req.files.option3[0].path,
//                     option4: req.files.option4[0].path
//                 },
//                 answerData:
//                 {
//                     inputType: answerType,
//                     answer: answerValue,
//                     answerExplaination: answerExplaination
//                 }
//             }
//             try {
//                 const questionUpdate = await Question.findByIdAndUpdate({_id: req.params.questionID},mainData)
//                 if(!questionUpdate)
//                 {
//                     res.status(200).json(
//                     {
//                         status: false,
//                         message: "QUestion Is not Updated!!"
//                     }
//                     )
//                 }
//                 else
//                 {
//                     res.status(200).json(
//                         {
//                             status: true,
//                             message: "Question Is Updated Successfully",
//                             data: questionUpdate
//                         }
//                     )
//                 }

//             } catch (error) {

//                 console.log(error);
//             }
//         }
//             catch(error)
//             {
//                 console.log(error);
//             }

// })

// router.get('/deleteTest/:testID/:questionID', async (req, res)=>
// {
//     try {

//         const test = await Test.findOne({_id: req.params.testID},
//             {
//                 mainContent:
//                 {
//                     $elemMatch:
//                     {
//                         _id: req.params.questionID
//                     }
//                 }
//             });
//             console.log(test);
//             if(!test)
//             {
//                 res.status(200).json(
//                     {
//                         status: false,
//                         message: "Question not found!!"
//                     }
//                 )
//             }
//             else
//             {
//                 const deleteQuestion = await Test.findOneAndUpdate({_id: req.params.testID}, {
//                     $pull:
//                     {
//                         mainContent:
//                         {
//                             _id: test._id
//                         }

//                     }
//                 })
//                 console.log(deleteQuestion);

//                 res.status(200).json(
//                     {
//                         status: true,
//                         message: "Deleted Successfully",
//                         dataDeleted: test

//                     }
//                 )

//             }

//     } catch (error) {

//     }
// })

router.get("/getAllTests", async (req, res) => {
	try {
		// const test = await Test.findOne({_id: "615ff1ba9e2abb927e6a659d"}).populate('mainContent');
		const test = await Test.find(
			{},
			{},
			{
				sort: {
					createdAt: -1,
				},
			}
		);
		if (!test) {
			res.status(200).json({
				status: false,
				message: "There Are no Tests in the Database!!",
			});
		} else {
			res.status(200).json({
				status: true,
				tests: test,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.get("/getCategoriesSub/:offset/:limit", async (req, res) => {
	const limit = parseInt(req.params.limit);
	const offset = (parseInt(req.params.offset) - 1) * limit;

	try {
		const result = await Category.find()
			.populate("subCategory")
			.limit(limit)
			.skip(offset);

		if (!result) {
			res.status(200).json({
				status: false,
				message: "Categories not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				categories: result,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.delete("/deleteTest/:testID", async (req, res) => {
	try {
		const testFind = await Test.findOne({ _id: req.params.testID });
		if (!testFind) {
			res.status(200).json({
				status: false,
				message: "Test Not Found",
			});
		} else {
			try {
				const deleteTest = await Test.findOneAndDelete({
					_id: req.params.testID,
				});
				if (!deleteTest) {
					res.status(200).json({
						status: false,
						message: "Test is not deleted",
					});
				} else {
					res.status(200).json({
						status: true,
						message: "Test is deleted Succesfully!!",
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	} catch (error) {
		console.log(error);
	}
});

router.get("/getAllSubCategories/:offset/:limit", async (req, res) => {
	const limit = parseInt(req.params.limit);
	const offset = (parseInt(req.params.offset) - 1) * limit;
	try {
		const subcategories = await subCategory.find().limit().skip(offset);
		if (!subcategories) {
			res.status(200).json({
				status: false,
				message: "Sub Categories Not Found",
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Sub Categories Found Are",
				subcategories: subcategories,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.post("/editTest/:testID", async (req, res) => {
	const test = await Test.findOne({ _id: req.params.testID });
	if (!test) {
		res.status(200).json({
			status: false,
			message: "Test not found",
		});
	} else {
		var {
			name,
			description,
			negativeMarking,
			correctAnswerMarking,
			totalMarks,
			duration,
			selectedDate,
			selectedTime,
			testType,
			minimumMarks,
		} = req.body;
		var data = {
			name,
			description,
			negativeMarking,
			correctAnswerMarking,
			totalMarks,
			selectedDate,
			selectedTime,
			testType,
		};

		var resultFromJoi = testValidator(
			"name description negativeMarking correctAnswerMarking totalMarks selectedDate selectedTime testType minimumMarks",
			data
		);
		console.log(resultFromJoi);

		if (!resultFromJoi) {
			res.status(200).json({
				status: false,
				message: "Validation Error!!",
				name: "min 3 Characters",
				description: "min 8 characters",
				negativeMarking: "number value is exprected",
				duration: "String Value is expected",
				correctAnswerMarking: "Number value is exprected",
				selectedDate: "Must Be String Value",
				selectedTime: "Must Be String",
				testType: "Must be enum Value as Practice or Test",
				QuestionCount: 0,
				minimumMarks: minimumMarks,
			});
		} else {
			try {
				const test = await Test.updateMany(
					{ _id: req.params.testID },
					{
						name: name,
						description: description,
						subCategoryID: req.params.subCategoryID,
						negativeMarking: negativeMarking,
						duration: duration,
						correctAnswerMarking: correctAnswerMarking,
						totalMarks: totalMarks,
						selectedDate: selectedDate,
						selectedTime: selectedTime,
						testType: testType,
						minimumMarks: minimumMarks,
					}
				);

				if (!test) {
					res.status(200).json({
						status: false,
						message: "Test is not updated",
					});
				} else {
					res.status(200).json({
						status: true,
						message: "Test is updated ",
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	}
});

router.put("/importQUestion/:testID/:questionID", async (req, res) => {
	try {
		const question = await Question.findOne({ _id: req.params.questionID });
		if (!question) {
			res.status(200).json({
				status: false,
				message: "Question Not Found!!",
			});
		} else {
			const questionUpdate = await Test.findOneAndUpdate(
				{ _id: req.params.testID },
				{
					$push: {
						mainContent: question._id,
					},
				}
			);

			if (!questionUpdate) {
				res.status(200).json({
					status: false,
					message: "Question is not Imported!!",
				});
			} else {
				res.status(200).json({
					status: true,
					message: `Question Importted Success Fully To ${req.params.testID}`,
					data: questionUpdate,
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
