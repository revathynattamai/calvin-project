/* eslint prefer-arrow-callback:0, func-names:0 */
require('chai').should();

const app = require('../../app');

require('chai').should();

const request = require('supertest');

const circleDAO = require('../../dao/circle');
const followDAO = require('../../dao/follow');
const mailboxDAO= require('../../dao/mailbox/');

describe('/follow api', function () {
  let circleId;
  let mailboxId;

  before(function (done) {
    circleId=circleDAO.createCircle().id;
    mailboxId=mailboxDAO.createMailbox().id;
    done();
  });
  it('should add if circle id, mailbox id exist and follower does not exist', function (done) {
    mailboxDAO.checkIfMailboxExists(mailboxId).should.be.equal(true);
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(false);

    request(app)
      .post(`/mailbox/${mailboxId}/circle/${circleId}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('circleId').equal(circleId).a('string');
        res.body.should.have.property('mailboxId').equal(mailboxId).a('string');
        followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(true);
        done();
      });
  });

  it('should fail to add follow if circle does not exist, but mailbox exists', function (done) {
    const randomCircleId=Math.floor(Math.random()*65678664467).toString();
    mailboxDAO.checkIfMailboxExists(mailboxId).should.be.equal(true);
    circleDAO.checkIfCircleExists(randomCircleId).should.be.equal(false);
    followDAO.checkIfFollowExists({ randomCircleId, mailboxId }).should.be.equal(false);
    request(app)
      .post(`/mailbox/${mailboxId}/circle/${randomCircleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle with id ${randomCircleId} does not exist`);
        followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId }).should.be.equal(false);
        done();
      });
  });

  it('should fail to add follow if mailbox id does not exist, but circle exists', function (done) {
    const randomMailboxId=Math.floor(Math.random()*65678664467).toString();
    mailboxDAO.checkIfMailboxExists(randomMailboxId).should.be.equal(false);
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    followDAO.checkIfFollowExists({ circleId, randomMailboxId }).should.be.equal(false);
    request(app)
      .post(`/mailbox/${randomMailboxId}/circle/${circleId}`)
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox with id ${randomMailboxId} does not exist`);
        followDAO.checkIfFollowExists({ circleId, mailboxId: randomMailboxId }).should.be.equal(false);
        done();
      });
  });

  it('should fail to add follow if circle id and mailbox id do not exist', function (done) {
    const randomCircleId=Math.floor(Math.random()*65678664467).toString();
    const randomMailboxId=Math.floor(Math.random()*65678664467).toString();
    mailboxDAO.checkIfMailboxExists(randomMailboxId).should.be.equal(false);
    circleDAO.checkIfCircleExists(randomCircleId).should.be.equal(false);
    followDAO.checkIfFollowExists({ randomCircleId, randomMailboxId }).should.be.equal(false);
    request(app)
      .post(`/mailbox/${randomMailboxId}/circle/${randomCircleId}`)
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox with id ${randomMailboxId} does not exist`);
        followDAO.checkIfFollowExists({ circleId: randomCircleId, randomMailboxId }).should.be.equal(false);
        done();
      });
  });

  it('should fail to Follow if follower already exists', function (done) {
    mailboxDAO.checkIfMailboxExists(mailboxId).should.be.equal(true);
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(true);
    request(app)
      .post(`/mailbox/${mailboxId}/circle/${circleId}`)
      .expect(409)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox ${mailboxId} is already following ${circleId}`);
        followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(true);
        done();
      });
  });

  it('should delete a follower', function (done) {
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    mailboxDAO.checkIfMailboxExists(mailboxId).should.be.equal(true);
    followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(true);
    request(app)
      .delete(`/mailbox/${mailboxId}/circle/${circleId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('mailboxId').equal(mailboxId).a('string');
        res.body.should.have.property('circleId').equal(circleId).a('string');
        followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(false);
        done();
      });
  });

  it('should fail to delete follower if follower does not exists', function (done) {
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    mailboxDAO.checkIfMailboxExists(mailboxId).should.be.equal(true);
    followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(false);
    request(app)
      .delete(`/mailbox/${mailboxId}/circle/${circleId}`)
      .expect(404)
      .end(function (err, res) {
        if (err) { done(err); return; }
        followDAO.checkIfFollowExists({ circleId, mailboxId }).should.be.equal(false);
        done();
      });
  });

  it('should fail to delete follower if circle id does not exist, but mailbox exists', function (done) {
    const randomCircleId=Math.floor(Math.random()*65678664467).toString();
    mailboxDAO.checkIfMailboxExists(mailboxId).should.be.equal(true);
    circleDAO.checkIfCircleExists(randomCircleId).should.be.equal(false);
    followDAO.checkIfFollowExists({ randomCircleId, mailboxId }).should.be.equal(false);
    request(app)
      .delete(`/mailbox/${mailboxId}/circle/${randomCircleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle with id ${randomCircleId} does not exist`);
        followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId }).should.be.equal(false);
        done();
      });
  });

  it('should fail to delete follower if mailbox id does not exist, but circle exists', function (done) {
    const randomMailboxId=Math.floor(Math.random()*65678664467).toString();
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    mailboxDAO.checkIfMailboxExists(randomMailboxId).should.be.equal(false);
    followDAO.checkIfFollowExists({ circleId, randomMailboxId }).should.be.equal(false);
    request(app)
      .delete(`/mailbox/${randomMailboxId}/circle/${circleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox with id ${randomMailboxId} does not exist`);
        followDAO.checkIfFollowExists({ circleId, mailboxId: randomMailboxId }).should.be.equal(false);
        done();
      });
  });

  it('should fail to delete follower if circle id and mailbox id do not exist', function (done) {
    const randomCircleId=Math.floor(Math.random()*65678664467).toString();
    const randomMailboxId=Math.floor(Math.random()*65678664467).toString();
    mailboxDAO.checkIfMailboxExists(randomMailboxId).should.be.equal(false);
    circleDAO.checkIfCircleExists(randomCircleId).should.be.equal(false);
    followDAO.checkIfFollowExists({ randomCircleId, randomMailboxId }).should.be.equal(false);
    request(app)
      .delete(`/mailbox/${randomMailboxId}/circle/${randomCircleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox with id ${randomMailboxId} does not exist`);
        followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId: randomMailboxId }).should.be.equal(false);
        done();
      });
  });
});
