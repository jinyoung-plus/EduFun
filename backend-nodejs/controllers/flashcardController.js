// EduFun/backend-nodejs/controllers/flashcardController.js
const { Flashcard } = require('../models/models');
const srsAlgorithm = require('../utils/srsAlgorithm');

const flashcardController = {
    // 플래시카드 생성
    async create(req, res) {
        try {
            const {front, back, deckId} = req.body;
            // SRS 알고리즘 초기 값 설정
            const easinessFactor = 2.5; // 기본 용이성 계수
            const intervalDays = 0;     // 복습 간격 초기값
            const repetitions = 0;      // 반복 횟수 초기값

            const newFlashcard = await Flashcard.create({
                user_id: req.user.id,
                deck_id: deckId, // deck_id 저장
                front,
                back,
                easiness_factor: easinessFactor,
                interval_days: intervalDays,
                repetitions: repetitions
            });
            res.status(201).json(newFlashcard);
        } catch (error) {
            res.status(500).send({message: 'Failed to create flashcard.'});
        }
    },

    // 사용자의 모든 플래시카드 조회
    async getAll(req, res) {
        try {
            const flashcards = await Flashcard.findAll({
                where: {user_id: req.user.id}
            });
            res.status(200).json(flashcards);
        } catch (error) {
            res.status(500).send({message: 'Failed to retrieve flashcards.'});
        }
    },

    // 특정 덱의 플래시카드 조회
    async getForDeck(req, res) {
        try {
            const {deckId} = req.params; // URL 경로에서 deckId를 추출합니다.
            console.log('Backend/ deckId:', deckId); // deckId 값을 콘솔에 출력 !!!진영 테스트용!!!!!!!!!!

            const flashcards = await Flashcard.findAll({
                where: {
                    user_id: req.user.id,
                    deck_id: deckId
                }
            });
            res.status(200).json(flashcards);
        } catch (error) {
            res.status(500).send({message: 'Failed to retrieve flashcards for the deck.'});
        }
    },

    // 플래시카드 업데이트 (복습 후)
    async update(req, res) {
        try {
            const {front, back, performanceRating} = req.body;
            const flashcard = await Flashcard.findByPk(req.params.id);

            if (!flashcard) {
                return res.status(404).send({message: 'Flashcard not found.'});
            }

            // 사용자의 성능 평가에 따라 SRS 알고리즘 적용
            const {newInterval, newEasinessFactor} = srsAlgorithm(
                performanceRating,
                flashcard.interval_days,
                flashcard.easiness_factor
            );

            const updated = await Flashcard.update({
                front,
                back,
                easiness_factor: newEasinessFactor,
                interval_days: newInterval,
                repetitions: flashcard.repetitions + 1
            }, {
                where: {id: req.params.id, user_id: req.user.id}
            });

            if (updated[0] > 0) {
                res.status(200).send({message: 'Flashcard updated.'});
            } else {
                res.status(404).send({message: 'Flashcard not found.'});
            }
        } catch (error) {
            res.status(500).send({message: 'Failed to update flashcard.'});
        }
    },

    // 플래시카드 삭제
    async delete(req, res) {
        try {
            const deleted = await Flashcard.destroy({
                where: {id: req.params.id, user_id: req.user.id}
            });

            if (deleted) {
                res.status(200).send({message: 'Flashcard deleted.'});
            } else {
                res.status(404).send({message: 'Flashcard not found.'});
            }
        } catch (error) {
            res.status(500).send({message: 'Failed to delete flashcard.'});
        }
    },

    // Bulk create flashcards
    async bulkCreate(req, res) {
        try {
            const {deckId, flashcards} = req.body; // Extract deckId and array of flashcards from the request body

            // You might want to validate deckId here to ensure it's provided
            if (!deckId) {
                return res.status(400).send({message: 'Deck ID must be provided.'});
            }

            // Use transaction if your ORM supports it, for atomic bulk creation
            const createdFlashcards = await Flashcard.bulkCreate(
                flashcards.map(card => ({
                    user_id: req.user.id,
                    deck_id: deckId,
                    front: card.front,
                    back: card.back,
                    easiness_factor: 2.5,
                    interval_days: 0,
                    repetitions: 0
                }))
                // Uncomment below if your ORM supports transactions
                // , { transaction: t }
            );

            res.status(201).json(createdFlashcards);
        } catch (error) {
            console.error('Bulk creation failed', error);
            res.status(500).send({message: 'Failed to create flashcards in bulk.'});
        }
    }
}



module.exports = flashcardController;
