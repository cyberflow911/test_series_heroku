const router = require("express").Router();
const Section = require("./../models/Section");
const { Test } = require("./../models/Test");
const { Question } = require("./../models/Questions");

router.post("/createSection/:testID/:language", async (req, res) => {
	let language;
	if (req.params.language.toLowerCase() === "hindi") {
		language = "mainContentHindi";
	} else if (req.params.language.toLowerCase() === "english") {
		language = "mainContentEnglish";
	}
	const section = new Section(req.body);

	try {
		if (!section) {
			res.status(500).json({
				status: false,
				message: "Section create failed",
			});
		}
		await section.save();

		const test = await Test.findOneAndUpdate(
			{ _id: req.params.testID },
			{
				$push: {
					[language]: section._id,
				},
			},
			{
				runValidators: true,
				new: true,
			}
		);

		res.status(201).json({
			status: true,
			message: "section created",
			section: section,
		});
	} catch (error) {
		console.log(error);
	}
});

router.get("/getSectionByID/:sectionID", async (req, res) => {
	const { limit, offset } = req.query;

	let limitQues, skipQues;

	if (!limit) {
		limitQues = 10;
	} else {
		limitQues = parseInt(limit);
	}

	if (!offset) {
		skipQues = 0;
	} else {
		skipQues = (parseInt(offset) - 1) * limitQues;
	}

	try {
		const section = await Section.findOne({ _id: req.params.sectionID })
			.populate({
				path: "questions",
				// options: { limit: limitQues, skip: skipQues, createdAt: -1 },
			})
			.exec();
		if (!section) {
			return res.status(404).json({
				status: false,
				message: "No Section found",
			});
		}
		res.status(200).json({
			status: true,
			section: section,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Server Error" + error,
		});
	}
});

router.delete(
	"/deleteSectionByID/:testID/:language/:sectionID",
	async (req, res) => {
		let language;
		if (req.params.language.toLowerCase() === "hindi") {
			language = "mainContentHindi";
		} else if (req.params.language.toLowerCase() === "english") {
			language = "mainContentEnglish";
		}
		Section.findOneAndDelete(
			{ _id: req.params.sectionID },
			function (error, docs) {
				if (error) {
					res.status(400).json({
						status: false,
						error: error,
					});
				} else {
					if (!docs) {
						res.status(404).json({
							status: false,
							message: "section not found",
						});
					} else {
						Test.findOneAndUpdate(
							{ _id: req.params.testID },
							{
								$push: {
									[language]: req.params.sectionID,
								},
							},
							{
								runValidators: true,
								new: true,
							},
							(error) => {
								if (error) {
									res.status(400).json({
										status: false,
										error: error,
									});
								} else {
									Question.deleteMany(
										{ sectionID: req.params.sectionID },
										(err, result) => {
											if (err) {
												res.status(400).json({
													status: false,
													error: err,
												});
											}
											console.log(result);
										}
									);
									res.status(200).json({
										status: true,
										message: "test updated and section deleted",
									});
								}
							}
						);
					}
				}
			}
		);
	}
);

router.patch("/updateSectionName/:sectionID", async (req, res) => {
	try {
		const section = await Section.findOneAndUpdate(
			{ _id: req.params.sectionID },
			{ sectionName: req.body.sectionName },
			{ runValidators: true, new: true }
		);
		if (!section) {
			res.status(404).json({
				status: false,
				message: "section not found",
			});
		}
		res.status(200).json({
			status: true,
			message: "section updated successfully",
			section: section,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Server error",
		});
	}
});

router.patch("/addQuestionIDs/:sectionID", async (req, res) => {
	try {
		const section = await Section.findOneAndUpdate(
			{ _id: req.params.sectionID },
			{
				$push: {
					questions: { $each: req.body },
				},
			},
			{
				runValidators: true,
				new: true,
			}
		);
		if (!section) {
			res.status(404).json({
				status: false,
				message: "section not found",
			});
		}
		res.status(200).json({
			status: true,
			message: "questions added to the section",
		});
	} catch (error) {
		console.log(error);
	}
});


router.get("/getSectionQuestionCount/:sectionId",async(req, res)=>{


	try{
		const section = await Section.findOne({ _id: req.params.sectionId })
		if(!section)
		{

			return res.status(404).json({
				status: false,
				message: "No Section found",
			});
		}

		const count = section?.questions?.length
		res.status(200).json({
			status: true,
			count: count,
		});
	}catch (error) 
	{

	}
})
router.patch("/hello", (req, res) => {
	res.send(req.body);
});

module.exports = router;
