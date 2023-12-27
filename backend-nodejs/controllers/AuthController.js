// EduFun/backend-nodejs/controllers/AuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

const AuthController = {
    async signup(req, res) {
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: hashedPassword
            });
            res.status(201).send({ id: newUser.id, email: newUser.email });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).send({ errorCode: 'EMAIL_EXISTS', message: 'Email already exists.' });
            } else {
                console.error('Error during user signup', error);
                res.status(500).send({ errorCode: 'SIGNUP_FAILED', message: 'Error during user signup.' });
            }
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const normalizedEmail = email.toLowerCase();
            const user = await User.findOne({ where: { email: normalizedEmail } });
            if (!user) {
                return res.status(404).send({ errorCode: 'ACCOUNT_NOT_FOUND', message: 'Account not found. Please sign up.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send({ errorCode: 'PASSWORD_INCORRECT', message: 'Password is incorrect. Please try again.' });
            }

            const payload = { id: user.id, email: user.email };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'your-secret-key-here',
                { expiresIn: '24h' }
            );

            res.status(200).send({ message: 'Logged in successfully', token });
        } catch (error) {
            console.error('Login error', error);
            res.status(500).send({ errorCode: 'LOGIN_FAILED', message: 'Error during login process.' });
        }
    }
};

module.exports = AuthController;
