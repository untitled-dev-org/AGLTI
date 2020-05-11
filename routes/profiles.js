const express = require('express');
const {
	createProfile,
	getMe,
	getMyProjects,
	getProfile,
	getUserProjects,
	getGithubRepos,
	updateProfile,
	addExperience,
	removeExperience,
	addEducation,
	removeEducation,
} = require('../controllers/profiles');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').post(protect, createProfile).put(protect, updateProfile);
router.get('/me', protect, getMe);
router.get('/me/projects', protect, getMyProjects);
router.get('/:userId', protect, getProfile);
router.get('/:userId/projects', protect, getUserProjects);
router.put('/experience', protect, addExperience);
router.delete('/experience/:expId', protect, removeExperience);
router.put('/education', protect, addEducation);
router.delete('/education/:eduId', protect, removeEducation);
router.get('/github/:username', protect, getGithubRepos);

module.exports = router;
