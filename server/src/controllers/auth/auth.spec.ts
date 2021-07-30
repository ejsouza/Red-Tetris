import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { SALT_ROUNDS, SECRET_TOKEN } from '../../config/const';
import { after } from 'mocha';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { TEST_BASE_URL } from '../../config/const';
import { AuthController } from '.';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Auth', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {});
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

  // it('should return 500 when an error is encountered', (done) => {
  //   const user = {
  //     email: 'testin2g@test.com',
  //     password: '123456Aa',
  //   };
  //   sinon.stub(() => {}, 'signin').throws(Error('login failed'));
  //   chai
  //     .request(TEST_BASE_URL)
  //     .post('/auth/signin')
  //     .send(user)
  //     .end((err, res) => {
  //       if (err) {
  //         done(err);
  //       }
  //       expect(res.status).to.equal(500);
  //       done();
  //     });
  // });
});
