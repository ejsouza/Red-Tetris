import User from '../../models/user';
import * as dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import { TEST_BASE_URL, SECRET_TOKEN } from '../../config/const';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Token', () => {
  const user = new User({
    email: 'verified@test.com',
    password: '123456Aa',
    status: 'verified',
  });

  before(async () => {
    await User.deleteMany({});
    await user.save();
  });

  it('token should create new user', (done) => {
    const user = {
      email: 'test@test.com',
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

  it('verify token', (done) => {
    chai
      .request(TEST_BASE_URL)
      .get('/token/verify?token=wrongToken')
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.err).to.equal('Unauthorized');
      });
    done();
  });

  it('should create token', (done) => {
    chai
      .request(TEST_BASE_URL)
      .post('/token/create')
      .send({ email: 'test@test.com' })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(201);
        expect(res.body.msg).to.equal('Token created, verify your email!');
        done();
      });
  });

  it('should not create token (already verifed)', (done) => {
    chai
      .request(TEST_BASE_URL)
      .post('/token/create')
      .send({ email: 'verified@test.com' })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('This account is already verified!');
        done();
      });
  });

  it('should return user not found (wrong email)', (done) => {
    chai
      .request(TEST_BASE_URL)
      .post('/token/create')
      .send({ email: 'verify@test.com' })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equal('User not found!');
        done();
      });
  });

  it('should return user not found (fake token)', (done) => {
    chai
      .request(TEST_BASE_URL)
      .get(
        '/token/verify?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGZmYTk2NTI3MGQ0NWNkM2YyODdiMjAiLCJpYXQiOjE2MjczNjc3ODEsImV4cCI6MTYyNzQ1NDE4MX0.b3SbjjOpLNZXTVrMhDPy1jjHb8_7nsaClCdqA9V2Gq4'
      )
      .send()
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(404);
        expect(res.body.err).to.equal('User not found');
        done();
      });
  });

  it('should verify token', async () => {
    const user = await User.findOne({ email: 'test@test.com' });
    const token = jwt.sign({ userId: user?._id }, SECRET_TOKEN, {
      expiresIn: '30s',
    });
    chai
      .request(TEST_BASE_URL)
      .get(`/token/verify?token=${token}`)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
      });
  });

  it('should be unauthorized token undefined', async () => {
    chai
      .request(TEST_BASE_URL)
      .get(`/token/verify?`)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.err).to.equal('Unauthorized');
      });
  });

  it('should rise expired token', async () => {
    const user = await User.findOne({ email: 'test@test.com' });
    const token = jwt.sign({ userId: user?._id }, SECRET_TOKEN, {
      expiresIn: '0s',
    });
    chai
      .request(TEST_BASE_URL)
      .get(`/token/verify?token=${token}`)
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(401);
      });
  });
});
