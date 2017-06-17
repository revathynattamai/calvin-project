const followDao = require('../follow');

const publishActivityMailbox =[];
let followArr = [];
const listeners = { };

const activities = { };

function publishToMailbox(mid, activity) {
  activities[mid].shift(activities);
  listeners[mid].forEach((socket) => {
    socket.emit('new activity', activity);
  });
}

function retriveMessageFromMailbox(mid) {
  return activities[mid];
}

function addListnerToMailbox(mid, socket) {
  socket.on('startListeningToMailBox', (data) => {
    listeners[mid].push(socket);
  });

  socket.on('stopListeningToMailbox', (data) => {
    const index=listeners[mid].indexOf(socket);
    listeners[mid].splice(index, 1);
  });
}

function sendToCircleMailbox(followArray, newActivity) {
  // console.log(`Follow arr${followArr}`);
  // console.log("circleId"+receiver);
  for (let i = 0; i < followArray.length; i += 1) {
    // console.log(followArr[i].mailboxId);
    const newactivity = {
      newActivity,
      receiver: followArray[i].mailboxId,
    };
    publishActivityMailbox.push(newactivity);
  }
  // console.log(`new act${newActivity}`);
}


function createPublishActivity(newActivity) {
  publishActivityMailbox.push(newActivity);
  followArr = followDao.splitMailId(newActivity.receiver);
  sendToCircleMailbox(followArr, newActivity);
  return newActivity;
}

function checkIfActivityPublished(mailboxId) {
  const filterMailBox = publishActivityMailbox.filter(userid => userid.receiver === mailboxId);
  return filterMailBox.length !== 0;
}

module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  checkIfActivityPublished,
  publishActivityMailbox,
  retriveMessageFromMailbox,
};
