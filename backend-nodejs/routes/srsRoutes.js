// backend-nodejs/routes/srsRoutes.js

const express = require('express');
const router = express.Router();
const Deck = require('../models/models'); // Ensure you import Deck and Flashcard models
const calculateSRS = require('../utils/srsAlgorithm');

router.post('/calculate', (req, res) => {
  const { performanceRating, currentInterval, easinessFactor } = req.body;
  try {
    const srsData = calculateSRS(performanceRating, currentInterval, easinessFactor);
    res.json(srsData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/decks', async (req, res) => {
  try {
    // Assuming that the user's authentication middleware adds their info to req.user
    if (!req.user || !req.user.id) {
      return res.status(401).send('Authentication required');
    }

    const userId = req.user.id; // Now correctly using the authenticated user's ID
    const decks = await Deck.findAll({
      where: { user_id: userId },
      attributes: ['id', 'name', 'description', 'cardcount'], // Make sure the attribute name matches exactly with the table column name
      raw: true
    });

    // Other route code...
  } catch (error) {
    res.status(500).json({ message: "Failed to get decks", error: error });
  }
});

router.get('/decks/:deckId/cards', async (req, res) => {
  try {
    const { deckId } = req.params;
    const cards = await Deck.getCards(deckId); // Replace with actual method to retrieve cards
    if (!cards) {
      return res.status(404).send('Deck not found or no cards exist for this deck.');
    }
    res.json(cards);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
