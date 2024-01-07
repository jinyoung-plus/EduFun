// EduFun/backend-nodejs/controllers/StudySessionController.js
const { StudySession } = require('../models/models');

const StudySessionController = {
  async create(req, res) {
    try {
      // Check for an existing active session
      const activeSession = await StudySession.findOne({
        where: {
          user_id: req.user.id,
          end_time: null
        }
      });

      if (activeSession) {
        // If an active session is found, return without creating a new one
        return res.status(200).send({ message: 'An active study session is already in progress.' });
      }

      // No active session found, create a new one with end_time as NULL
      const newStudySession = await StudySession.create({
        user_id: req.user.id,
        start_time: new Date(),
        end_time: null // Set end_time to NULL initially
      });
      res.status(201).json(newStudySession);
    } catch (error) {
      res.status(500).send({ message: 'Failed to start a study session.' });
    }
  },

  async end(req, res) {
    const sessionId = req.params.id;

    try {
      const sessionToEnd = await StudySession.findByPk(sessionId);

      if (!sessionToEnd) {
        return res.status(404).send({ message: 'No active study session to end.' });
      }

      sessionToEnd.end_time = new Date();
      const result = await sessionToEnd.save();

      console.log('Update result:', result); // Logging the result for debugging

      res.status(200).send({ message: 'Study session ended successfully.' });
    } catch (error) {
      console.error('Update error:', error); // Logging the error for debugging
      res.status(500).send({ message: 'Failed to end study session.', error: error.message });
    }
  },
      // Add a new method to handle the case when user navigates away without ending the session
  async handleUnfinishedSession(req, res) {
    let transaction;

    try {
      transaction = await StudySession.sequelize.transaction();

      const unfinishedSessions = await StudySession.findAll({
        where: {
          user_id: req.user.id,
          end_time: null
        }
      }, { transaction });

      for (const session of unfinishedSessions) {
        session.end_time = session.start_time; // Set end_time to the same as start_time
        await session.save({ transaction });
      }

      await transaction.commit();
      res.status(200).send({ message: 'Unfinished sessions have been updated.' });
    } catch (error) {
      if (transaction) await transaction.rollback();
      res.status(500).send({ message: 'Failed to update unfinished study sessions.', error: error.message });
    }
  }
};

module.exports = StudySessionController;

