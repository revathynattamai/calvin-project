const circleDAO = require('../../dao/circle');
const followDAO = require('../../dao/follow/');
const mailboxDAO= require('../../dao/mailbox/');

function createCircle(req, res) {
  res.status(201).json(circleDAO.createCircle());
}

function deleteCircle(req, res) {
  const CircleExist = circleDAO.checkIfCircleExists(req.params.circleId);
  if (CircleExist) {
    const result = circleDAO.deleteCircle(req.params.circleId);
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Circle id ${req.params.circleId} does not exist` });
  }
}

function follow(req, res) {
  const circleId=req.params.circleId;
  const mailboxId=req.params.mailboxId;

  if (!circleDAO.checkIfCircleExists(circleId)) {
    res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
    return;
  }

  if (!mailboxDAO.checkIfMailboxExists(mailboxId)) {
    res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
    return;
  }

  if (followDAO.checkIfFollowExists(circleId, mailboxId)) {
    res.status(409).json({ message: 'Follow already exists' });
    return;
  }
  const data=followDAO.addFollow(circleId, mailboxId);
  res.status(201).json(data);
}
function unfollow(req, res) {
  const circleId=req.params.circleId;
  const mailboxId=req.params.mailboxId;
  if (!circleDAO.checkIfCircleExists(circleId)) {
    res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
    return;
  }

  if (!mailboxDAO.checkIfMailboxExists(mailboxId)) {
    res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
    return;
  }

  if (!followDAO.checkIfFollowExists(circleId, mailboxId)) {
    res.status(404).json({ message: 'Link does not exists' });
    return;
  }
  const result = followDAO.deleteFollow(circleId, mailboxId);
  res.status(200).json(result);
}

module.exports = {
  createCircle, deleteCircle, follow, unfollow,
};
