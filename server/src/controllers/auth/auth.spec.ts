import User from '../../models/user';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { TEST_BASE_URL, SALT_ROUNDS } from '../../config/const';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Auth', () => {
  const user = new User({
    email: 'verified42@test.com',
    password: '123456Aa',
    status: 'verified',
  });

  before(async () => {
    await User.deleteMany({});
    const hash = await bcrypt.hash('123456Aa', SALT_ROUNDS);
    user.password = hash;
    await user.save();
  });

  it('signup should create new user', (done) => {
    const user = {
      email: 'testin2g@test.com',
      password: '123456Aa',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('invalid email format', (done) => {
    const user = {
      email: 'test.com',
      password: '12345Aa',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('Invalid email format');
        done();
      });
  });

  it('password should be at least eight characters long', (done) => {
    const user = {
      email: 'testin2g@test.com',
      password: '12345Aa',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal(
          'Password should be at least six characters long'
        );
        done();
      });
  });

  it('user email should be unique', (done) => {
    const user = {
      email: 'testin2g@test.com',
      password: '123456Aa',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('This email is already in use!');
        done();
      });
  });

  it('should not login (account not verified yet)', (done) => {
    const user = {
      email: 'testin2g@test.com',
      password: '123456Aa',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signin')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(403);
        expect(res.body.err).to.equal(
          'Please confirm your account first before login, we sent you an email confirmation, check your inbox!'
        );
        done();
      });
  });

  it('should not login (wrong password)', (done) => {
    const user = {
      email: 'verified42@test.com',
      password: '123456aA',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signin')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.err).to.equal('Incorrect password');
        done();
      });
  });

  it('signin user not found', (done) => {
    const user = {
      email: 'testg@test.com',
      password: '123456Aa',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signin')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.err).to.equal('User not found');
        done();
      });
  });

  it('should login', (done) => {
    const user = {
      email: 'verified42@test.com',
      password: '123456Aa',
    };
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signin')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(200);
        done();
      });
  });
});
