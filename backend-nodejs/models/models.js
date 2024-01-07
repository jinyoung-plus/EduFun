// EduFun/backend-nodejs/models/models.js

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://funedu:1234@localhost:5432/funedudb');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false // Sequelize가 자동으로 createdAt과 updatedAt을 관리하지 않게 설정
});


// Deck model definition
const Deck = sequelize.define('decks', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true // Description is optional
  },
  cardcount: {
    type: DataTypes.INTEGER, // cardCount 열 추가
    allowNull: false,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
});

// Flashcard 모델 정의
const Flashcard = sequelize.define('flashcards', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // 'users'는 User 모델의 테이블 이름입니다.
      key: 'id'
    }
  },
  deck_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // 덱이 선택적인 경우 allowNull을 true로 설정합니다.
    references: {
      model: 'decks', // 'decks'는 Deck 모델의 테이블 이름입니다.
      key: 'id'
    },
    onDelete: 'CASCADE' // 사용자가 삭제될 때 관련 Flashcards도 삭제됩니다.
  },
  front: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  back: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  easiness_factor: {
    type: DataTypes.FLOAT,
    defaultValue: 2.5,
    validate: {
      min: 1.3 // easiness_factor는 1.3 이상이어야 합니다.
    }
  },
  interval_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // interval_days의 기본값은 0입니다.
  },
  repetitions: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // repetitions의 기본값은 0입니다.
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false // Sequelize가 자동으로 createdAt과 updatedAt을 관리하지 않도록 설정합니다.
});


const StudySession = sequelize.define('study_sessions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  // Add the updated_at column
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false, // If you're not using Sequelize's built-in timestamps
  // If you're using Sequelize's built-in timestamps, you can remove timestamps: false and Sequelize will automatically handle created_at and updated_at
});

// Optional: Sequelize hooks for manually updating the 'updated_at' field if not using built-in timestamps
StudySession.beforeUpdate((session, options) => {
  session.updated_at = Sequelize.literal('CURRENT_TIMESTAMP');
});

// Review 모델 정의
const Review = sequelize.define('reviews', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  flashcard_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'flashcards',
      key: 'id'
    }
  },
  study_session_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'study_sessions',
      key: 'id'
    }
  },
  performance_rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review_time: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  next_review_date: {
    type: DataTypes.DATE
  },
  interval_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  easiness_factor: {
    type: DataTypes.FLOAT,
    defaultValue: 2.5,
    validate: {
      min: 1.3
    }
  },
  repetitions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false
});

// 모델 관계 설정
User.hasMany(Deck, { foreignKey: 'user_id' });
Deck.belongsTo(User, { foreignKey: 'user_id' });

// A Deck has many Flashcards
Deck.hasMany(Flashcard, { foreignKey: 'deck_id' });
Flashcard.belongsTo(Deck, { foreignKey: 'deck_id' });

User.hasMany(Flashcard, { foreignKey: 'user_id' });
Flashcard.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(StudySession, { foreignKey: 'user_id' });
StudySession.belongsTo(User, { foreignKey: 'user_id' });

Flashcard.hasMany(Review, { foreignKey: 'flashcard_id' });
Review.belongsTo(Flashcard, { foreignKey: 'flashcard_id' });

StudySession.hasMany(Review, { foreignKey: 'study_session_id' });
Review.belongsTo(StudySession, { foreignKey: 'study_session_id' });

// Module exports
module.exports = { sequelize, User, Flashcard, StudySession, Review, Deck };
