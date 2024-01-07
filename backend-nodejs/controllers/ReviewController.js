// EduFun/backend-nodejs/controllers/ReviewController.js
const { Flashcard, Review } = require('../models/models');
const srsAlgorithm = require('../utils/srsAlgorithm');

const ReviewController = {
  async createReview(req, res) {
    const { flashcardId, performanceRating, studySessionId } = req.body;
    console.log("Received request body:", req.body); // 로그 변경

    try {
      if (!flashcardId || !performanceRating || !studySessionId) {
        console.error("Validation error: Missing required fields in the request body"); // 로그 변경
        return res.status(400).send({ message: "Missing required fields." });
      }

      const flashcard = await Flashcard.findByPk(flashcardId);
      if (!flashcard) {
        console.error(`Flashcard not found for ID: ${flashcardId}`); // 로그 변경
        return res.status(404).send({ message: 'Flashcard not found' });
      }

      const srsData = srsAlgorithm(
        performanceRating,
        flashcard.interval_days,
        flashcard.easiness_factor,
        flashcard.repetitions
      );

      console.log("SRS Algorithm output:", srsData); // SRS 알고리즘 결과 로그 추가

      const updateResult = await Flashcard.update({
        easiness_factor: srsData.newEasinessFactor,
        interval_days: srsData.newInterval,
        repetitions: srsData.repetitions
      }, {
        where: { id: flashcardId }
      });

      console.log(`Flashcard update result for ID: ${flashcardId}:`, updateResult); // 플래시카드 업데이트 결과 로그 추가

      // Calculate next review date
      const reviewTime = new Date();
      const nextReviewDate = new Date(reviewTime.getTime() + srsData.newInterval * 24 * 60 * 60 * 1000);

      console.log(`Calculated nextReviewDate: ${nextReviewDate.toISOString()}`); // nextReviewDate 계산 로그 추가

// 로그를 추가하여 저장하기 전에 값들을 확인
      console.log({
        flashcard_id: flashcardId,
        study_session_id: studySessionId,
        performance_rating: performanceRating,
        reviewTime: reviewTime.toISOString(),
        nextReviewDate: nextReviewDate.toISOString(), // ISO 문자열로 변환하여 로깅
        intervalDays: srsData.newInterval,
        easinessFactor: srsData.newEasinessFactor,
        repetitions: srsData.repetitions
      });

      const newReview = await Review.create({
        flashcard_id: flashcardId,
        study_session_id: studySessionId,
        performance_rating: performanceRating,
        review_time: reviewTime, // 이 부분은 이미 맞게 설정되어 있습니다.
        next_review_date: nextReviewDate, // 'nextReviewDate'에서 'next_review_date'로 변경
        interval_days: srsData.newInterval, // 'intervalDays'에서 'interval_days'로 변경
        easiness_factor: srsData.newEasinessFactor, // 'easinessFactor'에서 'easiness_factor'로 변경
        repetitions: srsData.repetitions
      });

      console.log("New review record created:", newReview); // 새 리뷰 레코드 생성 로그 추가

      res.status(201).json(newReview);
    } catch (error) {
      console.error("Error during review creation:", error); // 로그 변경
      res.status(500).send({ message: 'Failed to create review', error: error.message });
    }
  }
};

module.exports = ReviewController;
