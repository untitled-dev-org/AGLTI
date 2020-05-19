const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Position = require('../models/Position');

// @desc	search developers for position
// @route	GET /api/v1/search/developers/:positionId
// @access	Private
exports.searchDevelopers = asyncHandler(async (req, res, next) => {
	const project = await Project.findById(req.project);
	const position = await Position.findById(req.params.positionId);

	// check if position exists
	if (!position) {
		return next(
			new ErrorResponse(
				`Resource not found with id of ${req.params.positionId}`,
				404
			)
		);
	}

	// check if position belongs to project
	if (
		!project.openings.some(
			(opening) => opening.position.toString() === position.id.toString()
		)
	) {
		return next(new ErrorResponse('position not part of project', 404));
	}

	const app = project.applicants.map((app) => {
		if (app.position.toString() === position.id.toString()) {
			return app.dev;
		}
	});
	const off = project.offered.map((off) => {
		if (off.position.toString() === position.id.toString()) {
			return off.dev;
		}
	});
	const exclude = app.concat(off);

	// pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = 20;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Profile.countDocuments({
		activeProject: undefined,
		skills: { $all: position.skills },
		user: { $nin: exclude },
	});

	const profiles = await Profile.find({
		activeProject: undefined,
		skills: { $all: position.skills },
		user: { $nin: exclude },
	})
		.skip(startIndex)
		.limit(limit)
		.select('user skills bio')
		.populate('user', 'name avatar');

	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}
	pagination.pages = Math.ceil(total / limit);

	res.status(200).json({
		success: true,
		count: profiles.length,
		pagination,
		total,
		position,
		data: profiles,
	});
});
