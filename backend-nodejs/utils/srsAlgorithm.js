// EduFun/backend-nodejs/utils/srsAlgorithm.js
/**
 * SRS 알고리즘을 구현한 함수.
 * @param {number} performanceRating - 사용자의 카드에 대한 성능 평가 (1-5)
 * @param {number} currentInterval - 현재 복습 간격 (일 단위)
 * @param {number} easinessFactor - 용이성 계수 (1.3 이상)
 * @return {Object} 새 복습 간격과 용이성 계수
 */
function calculateSRS(performanceRating, currentInterval, easinessFactor) {
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

    let newEasinessFactor = easinessFactor - 0.8 + 0.28 * performanceRating - 0.02 * performanceRating ** 2;
    newEasinessFactor = Math.max(1.3, newEasinessFactor);

    let newInterval;
    if (currentInterval === 0) {
        newInterval = 1;
    } else if (currentInterval === 1) {
        newInterval = 6;
    } else {
        newInterval = Math.round(currentInterval * newEasinessFactor);
    }

    if (!isFinite(newInterval) || !isFinite(newEasinessFactor)) {
        throw new Error('Invalid SRS calculation result');
    }

    return { newInterval, newEasinessFactor };
}

module.exports = calculateSRS;

