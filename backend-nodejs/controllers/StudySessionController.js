// EduFun/backend-nodejs/controllers/StudySessionController.js
const { StudySession } = require('../models/models');

const StudySessionController = {
    async create(req, res) {
        try {
            const newStudySession = await StudySession.create({
                user_id: req.user.id,
                start_time: new Date()
            });
            res.status(201).json(newStudySession);
        } catch (error) {
            res.status(500).send({ message: 'Failed to start a study session.' });
        }
    },

    async end(req, res) {
        try {
            const [updatedRows] = await StudySession.update({ end_time: new Date() }, {
                where: { id: req.params.id, user_id: req.user.id }
            });

            if (updatedRows > 0) {
                res.status(200).send({ message: 'Study session ended.' });
            } else {
                res.status(404).send({ message: 'Study session not found or already ended.' });
            }
        } catch (error) {
            res.status(500).send({ message: 'Failed to end study session.' });
        }
    }
};

module.exports = StudySessionController;
