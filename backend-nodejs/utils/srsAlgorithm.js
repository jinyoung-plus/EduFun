// EduFun/backend-nodejs/utils/srsAlgorithm.js
/**
 * SRS 알고리즘을 구현한 함수.
 * @param {number} performanceRating - 사용자의 카드에 대한 성능 평가 (1-5)
 * @param {number} currentInterval - 현재 복습 간격 (일 단위)
 * @param {number} easinessFactor - 용이성 계수 (1.3 이상)
 * @return {Object} 새 복습 간격과 용이성 계수
 */
function calculateSRS(performanceRating, currentInterval, easinessFactor) {
    if (performanceRating < 3) {
        // 성능 평가가 낮으면 복습 간격 초기화
        return { newInterval: 1, newEasinessFactor: easinessFactor };
    }

    // 용이성 계수 업데이트
    let newEasinessFactor = easinessFactor - 0.8 + 0.28 * performanceRating - 0.02 * performanceRating * performanceRating;
    newEasinessFactor = Math.max(1.3, newEasinessFactor); // 용이성 계수는 1.3 이상이어야 함

    // 새 복습 간격 계산
    let newInterval;
    if (currentInterval === 0) {
        newInterval = 1;
    } else if (currentInterval === 1) {
        newInterval = 6;
    } else {
        newInterval = Math.round(currentInterval * newEasinessFactor);
    }

    return { newInterval, newEasinessFactor };
}

module.exports = calculateSRS;
