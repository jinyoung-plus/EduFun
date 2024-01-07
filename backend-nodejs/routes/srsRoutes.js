// backend-nodejs/routes/srsRoutes.js

const express = require('express');
const router = express.Router();
const calculateSRS = require('../utils/srsAlgorithm');
const flashcardController = require('../controllers/flashcardController');
const { Deck, Flashcard, Review } = require('../models/models');
const { Op, Sequelize } = require('sequelize');

router.get('/decks/:deckId/flashcards/srs', async (req, res) => {
  try {
    const { deckId } = req.params;
    if (!req.user || !req.user.id) {
      return res.status(401).send('Authentication required');
    }

    // 현재 날짜보다 next_review_date가 같거나 이전인 카드만 가져옵니다.
    const cards = await Flashcard.findAll({
      where: {
        deckId: deckId,
        userId: req.user.id
      },
      include: [{
        model: Review,
        attributes: ['next_review_date'],
        required: false, // Review가 없는 카드도 포함합니다.
        where: {
          next_review_date: {
            [Op.lte]: Sequelize.fn('NOW') // 현재 날짜보다 이전 또는 같은 next_review_date
          }
        },
        order: [['next_review_date', 'ASC']], // 최신 리뷰를 우선으로 정렬
        limit: 1 // 각 카드에 대한 최신 리뷰만 가져옵니다.
      }],
      order: [
        [Sequelize.col('Review.next_review_date'), 'ASC'] // 전체 쿼리 결과를 next_review_date로 정렬
      ]
    });

    // 필요한 정보만 추출하여 응답합니다.
    const srsCards = cards.map(card => {
      const review = card.Reviews[0]; // 가장 최근 리뷰 정보
      return {
        ...card.toJSON(),
        next_review_date: review ? review.next_review_date : null
      };
    });

    res.json(srsCards);
  } catch (error) {
    console.error('Error fetching SRS cards:', error);
    res.status(500).send(error.message);
  }
});


router.post('/flashcards/bulk', flashcardController.bulkCreate);
router.post('/calculate', (req, res) => {
  const { performanceRating, currentInterval, easinessFactor } = req.body;
  // 요청 받은 데이터 로깅
  console.log('srsRouter1 Received SRS calculation request with:', req.body);
  // Add validation for all parameters
  if (typeof performanceRating === 'undefined' ||
      typeof currentInterval === 'undefined' ||
      typeof easinessFactor === 'undefined') {
    console.error('srsRouter2 Missing required parameters', req.body);
    return res.status(400).send('All parameters are required');
  }

  try {
    if (typeof performanceRating === 'undefined') {
      console.error('srsRouter2 performanceRating is undefined', req.body);
      return res.status(400).send('performanceRating is required');
    }

    const srsData = calculateSRS(performanceRating, currentInterval, easinessFactor);

    // 계산된 SRS 데이터 로깅
    console.log('srsRouter3 Calculated SRS data:', srsData);

    res.json(srsData);
  } catch (error) {
    console.error('srsRouter4 Error in SRS calculation:', error);
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
