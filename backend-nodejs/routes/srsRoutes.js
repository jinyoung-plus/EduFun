// Express 라우트 (backend-nodejs/routes/srsRoutes.js)

const express = require('express');
const router = express.Router();
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
