// EduFun/backend-nodejs/tests/srsAlgorithm.test.js

const calculateSRS = require('../utils/srsAlgorithm');

describe('SRS Algorithm', () => {
    test('should reset interval for low performance rating', () => {
        const result = calculateSRS(2, 10, 2.5);
        expect(result.newInterval).toBe(1);
        expect(result.newEasinessFactor).toBeCloseTo(2.5);
    });

    test('should increase interval for high performance rating', () => {
        const result = calculateSRS(5, 10, 2.5);
        expect(result.newInterval).toBeGreaterThan(10);
    });

    // 추가 테스트 케이스...
});
