const app = require('../../app');

const expect = require('chai').expect;

const request = require('supertest');

const mailboxDao = require('../../dao/mailbox/');

const circleDao = require('../../dao/circle/');

const followDAO = require('../../dao/follow');

const activityDao = require('../../dao/activity');

// CHANGEME: Describe test cases for "publish to circle" and "publish to mailbox"
describe('/publish to circle and mailbox', () => {
  // TODO: Pre assertion should be put inside before block
  let id;
  let circleId;
  let mailboxId;
  let newactivity;

  before(() => {
    circleId = circleDao.createCircle().id;
    mailboxId = mailboxDao.createMailbox().id;
    newactivity = {
      payload: {
        link: 'www.google.com',
        image: 'image.jpg',
      },
      receiver: circleId,
    };
  });

  it('should publish an activity to a circle and its mailboxid', (done) => {
    // TODO: Pre-action should always be present
    expect(mailboxDao.checkIfMailboxExists(circleId)).to.equal(true);
    expect(circleDao.checkIfCircleExists(circleId)).to.equal(true);
    const arr = activityDao.publishActivityMailbox;
    expect(arr).to.have.lengthOf(0);
    // TODO: Assert that mailbox has no activities


    request(app)
      .post(`/circle/${circleId}/activity`) // CHANGEME: URI from /publish/circle/:cid/activity --> /circle/:cid/activity
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        expect(activityDao.checkIfActivityPublished(circleId)).to.equal(true);
        expect(res.body).to.have.have.property('receiver');
        // expect(console.log(activityDao.createPublishActivity(newactivity))
        const result = activityDao.createPublishActivity(newactivity);
        // (result.payload).should.have.property('link').a('string');
        expect(result.payload).to.have.property('link').a('string');
        // expect(result.payload).to.not.be.empty;
        expect(arr).to.have.lengthOf.above(0);
        done();
      });
  });
});
