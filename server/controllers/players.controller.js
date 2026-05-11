const Player = require('../models/Player');
const Team = require('../models/Team');

/**
 * Get all players (optionally by team)
 */
const getAllPlayers = async (req, res) => {
  try {
    let players;
    if (req.query.team) {
      players = await Player.find({ team: req.query.team }).populate('team');
    } else {
      players = await Player.find().populate('team');
    }
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get specific player
 */
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team');
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create new player
 */
const createPlayer = async (req, res) => {
  try {
    const { name, jerseyNumber, position, team, stats } = req.body;
    const player = new Player({
      name,
      jerseyNumber,
      position,
      team,
      stats,
    });
    await player.save();
    await player.populate('team');
    res.status(201).json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update player stats (admin only)
 * You can update stats: goals, assists, saves, cleanSheets, appearances, yellowCards, redCards, MVP (awardPoints.mvpCount), and wins
 */
const updatePlayerStats = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    // Update stats fields
    const statFields = [
      'goals', 'assists', 'saves', 'cleanSheets',
      'appearances', 'yellowCards', 'redCards', 'wins'
    ];
    statFields.forEach(field => {
      if (req.body[field] !== undefined) {
        player.stats[field] = req.body[field];
      }
    });

    // Update MVPs (awardPoints.mvpCount)
    if (req.body.mvpCount !== undefined) {
      player.awardPoints.mvpCount = req.body.mvpCount;
    }

    player.updatedAt = Date.now();
    await player.save();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a player
 */
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayerStats,
  deletePlayer,
};
