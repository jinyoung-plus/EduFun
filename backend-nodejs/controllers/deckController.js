// EduFun/backend-nodejs/controllers/deckController.js

const { Deck } = require('../models/models');
// 덱 생성
const createDeck = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newDeck = await Deck.create({
            user_id: req.user.id,
            name,
            description
        });
        res.status(201).json(newDeck);
    } catch (error) {
        console.error(error); // 콘솔에 에러 출력
        res.status(500).json({ message: "Failed to create deck.", error: error.message }); // 오류 메시지를 명확하게 전달
    }
};

// 사용자의 덱 목록 조회
const getDecks = async (req, res) => {
    try {
        const userDecks = await Deck.findAll({
            where: { user_id: req.user.id }
        });
        res.status(200).json(userDecks);
    } catch (error) {
        res.status(500).json({ message: "Failed to get decks", error: error });
    }
};

// 덱 수정
const updateDeck = async (req, res) => {
    const deckId = parseInt(req.params.deckId, 10); // Ensure the ID is an integer
    if (isNaN(deckId)) {
        return res.status(400).json({ message: "Invalid deck ID" });
    }

    try {
        const { name, description } = req.body;
        // Check if the deck exists
        const deck = await Deck.findByPk(deckId);
        if (!deck) {
            return res.status(404).json({ message: "Deck not found" });
        }

        // Update the deck
        const updated = await Deck.update({ name, description }, {
            where: {
                id: deckId,
                user_id: req.user.id
            }
        });

        if (updated[0] > 0) {
            res.status(200).json({ message: "Deck updated successfully" });
        } else {
            res.status(404).json({ message: "No changes made to the deck" });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: "Failed to update deck", error: error.message });
    }
};

// 덱 삭제
const deleteDeck = async (req, res) => {
    try {
        const deleted = await Deck.destroy({
            where: {
                id: req.params.deckId,
                user_id: req.user.id
            }
        });

        if (deleted) {
            res.status(200).json({ message: "Deck deleted successfully" });
        } else {
            res.status(404).json({ message: "Deck not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete deck", error: error });
    }
};

module.exports = {
    createDeck,
    getDecks,
    updateDeck,
    deleteDeck
};
