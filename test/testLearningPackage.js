// models.js에서 LearningPackage 모델과 sequelize 인스턴스를 가져옵니다.
const { sequelize, LearningPackage } = require('../src/models/models');

// 데이터베이스와 모델을 동기화합니다.
sequelize.sync()
  .then(() => {
    console.log('데이터베이스 연결 성공');
    // 테스트 데이터를 생성합니다. 여기서 'username' 필드에 값을 제공해야 합니다.
    return LearningPackage.create({
      username: '테스트 사용자'
    });
  })
  .then(() => {
    // 데이터베이스에서 데이터를 조회합니다.
    return LearningPackage.findAll();
  })
  .then(users => {
    console.log('조회된 데이터:', users);
  })
  .catch(error => {
    console.error('에러 발생:', error);
  });
