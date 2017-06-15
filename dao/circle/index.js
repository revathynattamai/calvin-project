const mailboxDAO= require('../mailbox/');

const circles=[];

function createCircle() {
  const mailId=mailboxDAO.createMailbox().id;
  const newcircle = {
    id: mailId,
  };
  circles.push(newcircle);
  return newcircle;
}
function deleteCircle(circleId) {
  const filter = circles.filter(y => y.id === circleId);

  circles.splice(circles.indexOf(filter[0]), 1);
  return filter[0];
}


function checkIfCircleExists(circleId) {
  const filterCircle = circles.filter(circle => circle.id === circleId);
  return filterCircle.length!==0;
}
module.exports = {
  createCircle, deleteCircle, checkIfCircleExists,
};
