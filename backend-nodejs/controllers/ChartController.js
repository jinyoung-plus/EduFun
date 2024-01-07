// EduFun/backend-nodejs/controllers/ChartController.js
const { Op } = require('sequelize');
const { StudySession } = require('../models/models');

const getWeeklyStudyData = async (req, res) => {
  try {
    // Check if the request has query parameters for startDate and endDate
    let startDate;
    let endDate;
    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
      // Adjust endDate to the end of the day to include the last day completely
      endDate.setHours(23, 59, 59, 999);
    } else {
      // If not, use the last session to determine the date range
      const lastSession = await StudySession.findOne({
        where: {user_id: req.user.id},
        order: [['end_time', 'DESC']]
      });

      if (!lastSession) {
        return res.status(404).send({message: 'No study sessions found for the user.'});
      }

      // Ensure we're working with the user's local time
      endDate = new Date(lastSession.end_time);
      endDate.setHours(23, 59, 59, 999); // Set to the end of the day
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6); // Get the last 7 days including the last session day
      startDate.setHours(0, 0, 0, 0); // Set to start of the first day

        }
        const studySessions = await StudySession.findAll({
            where: {
                user_id: req.user.id,
                [Op.or]: [{
                    start_time: { [Op.between]: [startDate, endDate] }
                }, {
                    end_time: { [Op.between]: [startDate, endDate] }
                }]
            },
            order: [['start_time', 'ASC']]
        });


        // Convert startDate to the beginning of the day in the server's local timezone
        startDate.setHours(0, 0, 0, 0);
        // Initialize studyData with 0 minutes for each day
        let studyData = new Array(7).fill(0);

        studySessions.forEach(session => {
          // Skip sessions that have not ended yet
          if (session.end_time === null) {
            return;
          }
            const sessionStart = new Date(session.start_time);
            const sessionEnd = new Date(session.end_time);

            // Check if the session spans multiple days and split if necessary
            if (sessionStart.toDateString() !== sessionEnd.toDateString()) {
                // Handle session spanning multiple days
                const endOfStartDay = new Date(sessionStart);
                endOfStartDay.setHours(23, 59, 59, 999);
                const durationFirstDay = (endOfStartDay - sessionStart) / (1000 * 60);
                const durationSecondDay = (sessionEnd - endOfStartDay) / (1000 * 60);

                let indexFirstDay = (sessionStart - startDate) / (1000 * 60 * 60 * 24);
                indexFirstDay = Math.floor(indexFirstDay);

                let indexSecondDay = (sessionEnd - startDate) / (1000 * 60 * 60 * 24);
                indexSecondDay = Math.floor(indexSecondDay);

                studyData[indexFirstDay] += durationFirstDay;
                studyData[indexSecondDay] += durationSecondDay;
            } else {
                // Session is within a single day
                let sessionDateIndex = (sessionStart - startDate) / (1000 * 60 * 60 * 24);
                sessionDateIndex = Math.floor(sessionDateIndex);

                const durationMinutes = (sessionEnd - sessionStart) / (1000 * 60);
                studyData[sessionDateIndex] += durationMinutes;
            }
            //console.log(`b2 Calculated studyData: `, studyData);
        });

        res.json(studyData);
    } catch (error) {
        console.error('Failed to get weekly study data', error);
        res.status(500).send({ message: 'Failed to get weekly study data' });
    }
};

module.exports = {
    getWeeklyStudyData
};
