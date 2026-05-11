const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');
const awardsController = require('../controllers/awards.controller');

const router = express.Router();

// Get all awards with leaderboards
router.get('/', awardsController.getAllAwards);

// Get specific award by ID (with leaderboard)
router.get('/:id', awardsController.getAwardById);

// Get leaderboard for a specific award
router.get('/:id/leaderboard', awardsController.getAwardLeaderboard);

// Create a new award (admin only)
router.post('/', authMiddleware, adminOnly, awardsController.createAward);

// Update an award (admin only)
router.put('/:id', authMiddleware, adminOnly, awardsController.updateAward);

// Auto-assign current winner based on points (admin only)
router.post('/:id/auto-assign', authMiddleware, adminOnly, awardsController.autoAssignWinner);

// Delete an award (admin only)
router.delete('/:id', authMiddleware, adminOnly, awardsController.deleteAward);

module.exports = router;
