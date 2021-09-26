import { Request } from 'express';
import * as dotenv from 'dotenv';
import * as sinon from 'sinon';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import { PasswordController } from '../controllers/password';
import { TEST_BASE_URL } from '../config/const';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Password', () => {
  let status: any, json: any, res: any;

  before((done) => {
    it('signup should create new user', (done) => {
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
    done();
  });

  beforeEach(async () => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
  });

  it('should not reset password incorrect email', async function () {
    const req = { body: { email: 'test.com' } };
    await new PasswordController().reset(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(400);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('Invalid email format');
  });

  it('should not reset password have no permission', async function () {
    const req = {
      body: {
        email: faker.internet.email(),
        password: '123456Aa',
      },
    };
    await new PasswordController().reset(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(401);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal("You don't have permission!");
  });

  it('should reset password', async function () {
    const req = {
      body: {
        email: 'dummy@test.com',
        password: '123456Aa',
      },
    };
    await new PasswordController().reset(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(201);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('Token created, verify your email!');
  });
});
