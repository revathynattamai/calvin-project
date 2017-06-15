require('chai').should();

const app = require('../../app');

const expect = require('chai').expect;
require('chai').should();

const request = require('supertest');


const circleDAO = require('../../dao/circle');
const mailboxDAO= require('../../dao/mailbox/');

describe('/circle api', () => {
  let circleId;
  it('it should create a new circle', (done) => {
    request(app)
      .post('/circle/')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('string');
        circleId = res.body.id;
        circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
        mailboxDAO.checkIfMailboxExists(circleId).should.be.equal(true);
        done();
      });
  });

  it('should delete a circle', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        expect(res.body.id).to.equal(circleId);
        done();
      });
  });

  it('should fail when we try to delete a circle id that does not exist', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        expect(res.body).to.have.property('message').equal(`Circle id ${circleId} does not exist`);
        done();
      });
  });
});
