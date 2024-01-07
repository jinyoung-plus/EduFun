// EduFun/backend-nodejs/server.js
const express = require('express');
const cors = require('cors');
const srsRoutes = require('./routes/srsRoutes'); // 라우트 파일 임포트
const bcrypt = require('bcrypt');
const { sequelize, User, Flashcard, StudySession, Review } = require('./models/models');
const jwt = require('jsonwebtoken');

const app = express();

// Controller 모듈 가져오기
const AuthController = require('./controllers/AuthController');
const flashcardController = require('./controllers/flashcardController');
const StudySessionController = require('./controllers/StudySessionController');
const ReviewController = require('./controllers/ReviewController');
const deckController = require('./controllers/deckController');
const ChartController = require('./controllers/ChartController');


// JWT 검증 미들웨어
const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length); // Skip the 'Bearer ' part
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).send({ errorCode: 'INVALID_TOKEN', message: 'Invalid authentication token.' });
    }
  } else {
    return res.status(401).send({ errorCode: 'NO_AUTH_HEADER', message: 'No authentication token provided.' });
  }
};

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// API 라우트 등록
app.use('/api', srsRoutes);

// 회원가입 및 로그인 라우트
app.post('/signup', AuthController.signup);
app.post('/login', AuthController.login);
app.post('/reset-password', AuthController.resetPassword);

// 데크 관련 라우트
app.post('/decks', jwtMiddleware, deckController.createDeck);
app.get('/decks', jwtMiddleware, deckController.getDecks);
app.get('/decks/:id', jwtMiddleware, deckController.getDecks);
app.put('/decks/:deckId', jwtMiddleware, deckController.updateDeck);
app.delete('/decks/:deckId', jwtMiddleware, deckController.deleteDeck);

// Flashcards 관련 라우트
app.get('/decks/:deckId/flashcards', jwtMiddleware, flashcardController.getForDeck);
app.get('/flashcards', jwtMiddleware, flashcardController.getAll);
app.post('/flashcards', jwtMiddleware, flashcardController.create);
app.post('/flashcards/bulk', jwtMiddleware, flashcardController.bulkCreate); // Bulk create route
app.put('/flashcards/:id', jwtMiddleware, flashcardController.update);
app.delete('/flashcards/:id', jwtMiddleware, flashcardController.delete);

// Study Sessions 관련 라우트
app.post('/study-sessions', jwtMiddleware, StudySessionController.create);
app.put('/study-sessions/:id', jwtMiddleware, StudySessionController.end);
app.patch('/study-sessions/unfinished', jwtMiddleware, StudySessionController.handleUnfinishedSession);

// Reviews 관련 라우트
//app.post('/reviews', jwtMiddleware, ReviewController.create);
app.post('/reviews/process', jwtMiddleware, ReviewController.createReview);

// Chart 관련 라우트
app.get('/weekly-study-data', jwtMiddleware, ChartController.getWeeklyStudyData);

// 데이터베이스 동기화 및 서버 시작
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
