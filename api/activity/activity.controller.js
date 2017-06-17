const activityDao = require('../../dao/activity');
const followDao = require('../../dao/follow');


function createPublishActivity(req, res) {
  const payload=req.body;
  const newActivity = {
    timestamp: req.timestamp,
    payload,
    receiver: req.params.circleId,
  };
  res.status(201).json(activityDao.createPublishActivity(newActivity));
}
module.exports={
  createPublishActivity,
};
