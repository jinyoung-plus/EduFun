"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("./models/models");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:4200' }));
app.use(express_1.default.json());
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await models_1.User.create({
            email,
            password: hashedPassword
        });
        res.status(201).send({ id: newUser.id, email: newUser.email });
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send('Email already exists.');
        }
        else {
            console.error('Error during user signup', error);
            res.status(500).send('Error during user signup.');
        }
    }
});
models_1.sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map