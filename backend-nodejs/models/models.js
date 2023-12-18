// EduFun/src/models/models.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://funedu:1234@localhost:5432/funedudb');

const LearningPackage = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 다른 필요한 칼럼들...
}, {
  // 모델 설정
});

// Reservation 모델 정의
const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reservation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reservation_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number_of_guests: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  special_requests: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // 추가 필드 설정 가능
}, {
  // 모델 설정
});

const Contact = sequelize.define('Contact', {
  // ... 연락처 모델 정의
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// 모듈로 내보내기
module.exports = { sequelize, LearningPackage, Reservation, Contact };
