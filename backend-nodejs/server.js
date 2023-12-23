//EduFun/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { LearningPackage } = require('./models/models'); // Sequelize 모델
const { sequelize } = require('./models/models'); // sequelize 객체를 가져와야 함
const { Reservation } = require('./models/models'); // Reservation 모델을 가져와야 함
const { Contact } = require('./models/models'); // 가정: Sequelize 모델을 사용한다고 가정합니다.

const app = express();

// CORS 미들웨어 사용 설정
// 개발 단계에서 모든 도메인의 요청을 허용하거나, 특정 도메인에 대해서만 허용 설정
app.use(cors({
  origin: 'http://localhost:4200' // 프론트엔드 서버의 URL
}));

app.use(bodyParser.json());
// ... 나머지 서버 설정 및 라우트

app.post('/users', async (req, res) => {
  console.log('Received username from frontend:', req.body.username); // 로그 추가
  const t = await sequelize.transaction(); // 트랜잭션 시작

  try {
    const { username } = req.body;
    // 트랜잭션을 사용하여 데이터베이스 작업 수행
    const newUser = await LearningPackage.create({ username }, { transaction: t });

    await t.commit(); // 트랜잭션 커밋
    console.log(`New user added: ${newUser.username}`);
    res.status(201).send(newUser);
  } catch (error) {
    await t.rollback(); // 트랜잭션 롤백
    console.error('Error during transaction', error);
    res.status(400).send(error);
  }
});
// 데이터베이스 동기화 코드 추가
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
