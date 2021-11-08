module.exports = (modal) => {
	return async (req, res, next) => {
		// query object. subject will be founded based on it
		const query = {};
		const results = {};

		const documentsCount = await modal.countDocuments().exec();

		let page, limit, sortByDate;

		if (!parseInt(req.query.limit)) {
			limit = 10;
		} else {
			limit = parseInt(req.query.limit);
		}

		results.totalPages = Math.ceil(documentsCount / limit);

		if (!parseInt(req.query.page) || parseInt(req.query.page) <= 0) {
			page = 1;
		} else if (parseInt(req.query.page) > results.totalPages) {
			page = results.totalPages;
		} else {
			page = parseInt(req.query.page);
		}

		if (req.query.sortByDate) {
			if (req.query.sortByDate === "asc") sortByDate = -1;
			if (req.query.sortByDate === "dsc") sortByDate = 1;
		} else {
			sortByDate = 1;
		}

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit: limit,
			};
		}

		if (endIndex < documentsCount) {
			results.next = {
				page: page + 1,
				limit: limit,
			};
		}

		if (req.query.searchString) {
			query.subjectName = {
				$regex: new RegExp(req.query.searchString.trim(), "i"),
			};
		}

		// check if status is correct
		if (req.query.status) {
			const allowableStatus = ["active", "inactive"];
			const isValidStatus = allowableStatus.includes(req.query.status.trim());
			if (isValidStatus) query.status = req.query.status.trim();
		}

		// if date filter is enable through query
		if (req.query.startDate) {
			let startDate, endDate;
			startDate = req.query.startDate;
			if (!req.query.endDate) {
				endDate = new Date();
			} else {
				endDate = req.query.endDate;
			}
			query.createdAt = {
				$gt: new Date(new Date(startDate).setHours(00, 00, 01)),
				$lt: new Date(new Date(endDate).setHours(23, 59, 59)),
			};
		}

		try {
			const modalResults = await modal
				.find(query)
				.limit(limit)
				.skip(startIndex)
				.sort({ createdAt: sortByDate })
				.exec();

			if (modalResults.length === 0) {
				res.status(200).json({
					status: false,
					message: "No documents are Found",
				});
			} else {
				results.data = modalResults;
				req.results = {
					status: true,
					results: results,
				};
			}
		} catch (error) {
			console.log(error);
		}

		next();
	};
};
