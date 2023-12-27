// backend-nodejs/app.js

const srsRoutes = require('./routes/srsRoutes');
// 다른 필요한 미들웨어 및 라우트 설정 후...

app.use('/api/srs', srsRoutes);
