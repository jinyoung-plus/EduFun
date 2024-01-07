// EduFun/backend-nodejs/utils/srsAlgorithm.js
/**
 * SRS 알고리즘을 구현한 함수.
 * @param {number} performanceRating - 사용자의 카드에 대한 성능 평가 (1-5)
 * @param {number} currentInterval - 현재 복습 간격 (일 단위)
 * @param {number} easinessFactor - 용이성 계수 (1.3 이상)
 * @param {number} repetitions - Current repetition count for the card.
 * @return {Object} New review interval, easiness factor, and repetition count.
 */
function calculateSRS(performanceRating, currentInterval, easinessFactor, repetitions) {
    let invalidParams = [];
    if (typeof performanceRating !== 'number') {
        invalidParams.push(`performanceRating expected a number, got ${typeof performanceRating}`);
    }
    if (typeof currentInterval !== 'number') {
        invalidParams.push(`currentInterval expected a number, got ${typeof currentInterval}`);
    }
    if (typeof easinessFactor !== 'number') {
        invalidParams.push(`easinessFactor expected a number, got ${typeof easinessFactor}`);
    }
    if (performanceRating < 1 || performanceRating > 5) {
        invalidParams.push(`performanceRating out of range, got ${performanceRating}`);
    }
    if (easinessFactor < 1.3) {
        invalidParams.push(`easinessFactor below minimum, got ${easinessFactor}`);
    }
    if (!isFinite(currentInterval)) {
        invalidParams.push(`currentInterval not finite, got ${currentInterval}`);
    }

    if (invalidParams.length > 0) {
        throw new Error('Invalid input parameters: ' + invalidParams.join('; '));
    }

  // Adjust easiness factor according to user's performance
  let newEasinessFactor = easinessFactor - 0.8 + 0.28 * performanceRating - 0.02 * performanceRating ** 2;
  newEasinessFactor = Math.max(1.3, newEasinessFactor); // Easiness factor should not fall below 1.3

  // Calculate the new interval
  let newInterval = currentInterval;
  if (performanceRating >= 3) {
    // User remembered the card
    repetitions += 1;
    if (repetitions === 1) {
      newInterval = 1; // First repetition interval
    } else if (repetitions === 2) {
      newInterval = 6; // Second repetition interval
    } else {
      newInterval = Math.round(currentInterval * newEasinessFactor); // Subsequent intervals
    }
  } else {
    // User did not remember the card
    repetitions = 0; // Reset repetitions
    newInterval = 1; // Reset interval
  }

  // Return the new interval, easiness factor, and repetitions
  return {
    newInterval,
    newEasinessFactor,
    repetitions
  };
}

module.exports = calculateSRS;

