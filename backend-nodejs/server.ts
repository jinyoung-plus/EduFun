import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { sequelize, User } from './models/models'; // 모델 경로는 프로젝트에 따라 다를 수 있습니다.

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.post('/api/signup', async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body as { email: string; password: string };
        const hashedPassword = await bcrypt.hash(password, 10);
        // User 모델이 올바른 타입을 가지고 있는지 확인해야 합니다.
        const newUser = await User.create({ email, password: hashedPassword });
        // Sequelize에서 create 메소드는 자동으로 id를 생성하므로, 타입 정의에서 id를 옵셔널로 처리해야 합니다.
        res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ message: 'Email already exists.' });
        } else {
            console.error('Error during user signup:', error);
            res.status(500).json({ message: 'Error during user signup.' });
        }
    }
});

sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});

const port = process.env['PORT'] || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

