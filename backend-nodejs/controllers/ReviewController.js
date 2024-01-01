// EduFun/backend-nodejs/controllers/ReviewController.js
const { Review, Flashcard } = require('../models/models');

const ReviewController = {
    async create(req, res) {
        if (!req.user || !req.user.id) {
            return res.status(401).send({ message: 'Authentication required' });
        }

        const userId = req.user.id;
        const {
            flashcard_id,
            performance_rating,
            study_session_id,
            newInterval,
            newEasinessFactor,
            repetitions
        } = req.body;

        if (!flashcard_id || !performance_rating || !study_session_id ||
            newInterval === undefined || newEasinessFactor === undefined || repetitions === undefined) {
            return res.status(400).send({ message: 'Missing required fields.' });
        }

        try {
            // 플래시카드 업데이트와 리뷰 생성을 하나의 트랜잭션으로 처리
            const result = await sequelize.transaction(async (t) => {
                // 플래시카드 업데이트
                const [updated] = await Flashcard.update({
                    easiness_factor: newEasinessFactor,
                    interval_days: newInterval,
                    repetitions
                }, {
                    where: { id: flashcard_id, user_id: userId },
                    transaction: t
                });

                if (!updated) {
                    throw new Error('Flashcard not found or user not authorized.');
                }

                // 새 리뷰 생성
                const newReview = await Review.create({
                    flashcard_id,
                    study_session_id,
                    performance_rating,
                    review_time: new Date(),
                    next_review_date: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
                    interval_days: newInterval,
                    easiness_factor: newEasinessFactor,
                    repetitions
                }, { transaction: t });

                return newReview;
            });

            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).send({ message: 'Error creating review.' });
        }
    }
};


module.exports = ReviewController;

