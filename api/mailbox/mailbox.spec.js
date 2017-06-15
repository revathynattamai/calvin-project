const app = require('../../app');

const expect = require('chai').expect;
const request = require('supertest');

const mailboxDao = require('../../dao/mailbox/');


describe('/mailbox api', () => {
  let id;
  it('should create a new mailbox', (done) => {
    request(app)
      .post('/mailbox')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('string');
        id = res.body.id;
        expect(mailboxDao.checkIfMailboxExists(id)).to.equal(true);
        done();
      });
  });

  it('should delete a mailbox', (done) => {
    request(app)
      .delete(`/mailbox/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.equal(id);
        expect(mailboxDao.checkIfMailboxExists(id)).to.equal(false);
        done();
      });
  });

  it('should return an error when we try to delete a mailbox that does not exist', (done) => {
    request(app)
      .delete(`/mailbox/${id}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('message').equal(`Mailbox with id ${id} does not exist`);
        expect(mailboxDao.checkIfMailboxExists(id)).to.equal(false);
        done();
      });
  });
});
