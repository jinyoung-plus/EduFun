// EduFun/backend-nodejs/controllers/ReviewController.js
const { Review, Flashcard } = require('../models/models');
const srsAlgorithm = require('../utils/srsAlgorithm');

const ReviewController = {
    async create(req, res) {
        try {
            const { flashcard_id, performance_rating, study_session_id } = req.body;
            const flashcard = await Flashcard.findByPk(flashcard_id);

            if (!flashcard) {
                return res.status(404).send({ message: 'Flashcard not found.' });
            }

            // SRS 알고리즘을 사용해 복습 데이터를 계산합니다.
            const { newInterval, newEasinessFactor } = srsAlgorithm(
                performance_rating,
                flashcard.interval_days,
                flashcard.easiness_factor
            );

            // 새로운 복습 날짜를 계산합니다.
            const nextReviewDate = new Date();
            nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

            const newReview = await Review.create({
                flashcard_id,
                study_session_id,
                performance_rating,
                review_time: new Date(),
                next_review_date: nextReviewDate,
                interval_days: newInterval,
                easiness_factor: newEasinessFactor,
                // 'repetitions'은 Flashcard 모델에서 업데이트 해야 합니다.
            });

            // 플래시카드 모델의 복습 관련 데이터를 업데이트합니다.
            await Flashcard.update(
                {
                    easiness_factor: newEasinessFactor,
                    interval_days: newInterval,
                    repetitions: flashcard.repetitions + 1
                },
                {
                    where: { id: flashcard_id }
                }
            );

            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).send({ message: 'Failed to create review.' });
        }
    }
};

module.exports = ReviewController;
