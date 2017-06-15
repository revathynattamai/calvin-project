
const mailboxDao = require('../../dao/mailbox');

function createMailbox(req, res) {
  res.status(201).json(mailboxDao.createMailbox());
}

function deleteMailbox(req, res) {
  const id = req.params.id;
  const isMailBoxPresent = mailboxDao.checkIfMailboxExists(id);
  if (isMailBoxPresent) {
    const result=mailboxDao.deleteMailbox(id);
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Mailbox with id ${id} does not exist` });
  }
}

module.exports = {
  createMailbox,
  deleteMailbox,
};
