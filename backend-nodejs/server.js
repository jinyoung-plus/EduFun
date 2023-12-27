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


// JWT 검증 미들웨어
const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ errorCode: 'NO_AUTH_HEADER', message: 'No authentication token provided.' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"에서 TOKEN 부분을 가져옵니다.
  if (!token) {
    return res.status(401).send({ errorCode: 'NO_TOKEN', message: 'Authentication token is not provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send({ errorCode: 'INVALID_TOKEN', message: 'Invalid authentication token.' });
  }
};

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// API 라우트 등록
app.use('/api', srsRoutes);

// 회원가입 및 로그인 라우트
app.post('/signup', AuthController.signup);
app.post('/login', AuthController.login);

// 데크 관련 라우트
app.post('/decks', jwtMiddleware, deckController.createDeck);
app.get('/decks', jwtMiddleware, deckController.getDecks);
app.put('/decks/:deckId', jwtMiddleware, deckController.updateDeck);
app.delete('/decks/:deckId', jwtMiddleware, deckController.deleteDeck);

// Flashcards 관련 라우트
app.get('/decks/:deckId/flashcards', jwtMiddleware, flashcardController.getForDeck);
app.get('/flashcards', jwtMiddleware, flashcardController.getAll);
app.post('/flashcards', jwtMiddleware, flashcardController.create);
app.put('/flashcards/:id', jwtMiddleware, flashcardController.update);
app.delete('/flashcards/:id', jwtMiddleware, flashcardController.delete);

// Study Sessions 관련 라우트
app.post('/study-sessions', jwtMiddleware, StudySessionController.create);
app.put('/study-sessions/:id', jwtMiddleware, StudySessionController.end);

// Reviews 관련 라우트
app.post('/reviews', jwtMiddleware, ReviewController.create);

// 데이터베이스 동기화 및 서버 시작
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

<<<<<<< HEAD
=======
// 예약 엔드포인트 추가
app.post('/reservations', async (req, res) => {
  console.log('Received reservation data:', req.body);
  const t = await sequelize.transaction();

  try {
    // req.body에서 예약 데이터 추출
    const {
      venue,
      date, // 'date' 변수를 올바르게 사용
      time, // 'time' 변수를 올바르게 사용
      name,
      email,
      phone,
      guests, // 'guests'는 'number_of_guests'로 변환해야 할 수도 있습니다.
      specialRequests
    } = req.body;

    // 트랜잭션을 사용하여 Reservation 테이블에 새 예약 데이터 저장
    const newReservation = await Reservation.create({
      venue,
      reservation_date: date, // 'date' 값을 'reservation_date' 필드에 할당
      reservation_time: time, // 'time' 값을 'reservation_time' 필드에 할당
      name,
      email,
      phone,
      number_of_guests: guests, // 'guests' 값을 'number_of_guests' 필드에 할당
      special_requests: specialRequests
    }, { transaction: t });

    await t.commit();
    console.log(`New reservation added: ${newReservation.id}`);
    res.status(201).send(newReservation);
  } catch (error) {
    await t.rollback();
    console.error('Error during reservation transaction', error);
    res.status(400).send(error);
  }
});

app.post('/contacts', async (req, res) => {
  try {
    const newContact = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Error saving contact message.' });
  }
});

// 연락처 데이터를 가져오는 라우트
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll(); // Sequelize를 사용할 경우
    res.json(contacts);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// 예약 데이터를 가져오는 라우트
app.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations', error);
    res.status(500).json({ message: 'Error fetching reservations.' });
  }
});

app.post('/words', async (req, res) => {
  try {
    const { frontend, backend } = req.body;

    // 트랜잭션을 사용하여 데이터베이스 작업 수행
    const newWord = await Word.create({ frontend, backend });

    console.log(`New word added: ${newWord.frontend} - ${newWord.backend}`);
    res.status(201).json(newWord);
  } catch (error) {
    console.error('Error saving word', error);
    res.status(500).json({ message: 'Error saving word.' });
  }
});

>>>>>>> 2bef0d337ba1be9af7f9a79a70dd3cab85f37d25
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
