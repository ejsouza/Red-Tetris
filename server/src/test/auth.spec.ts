// import * as mocha from 'mocha';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';
import * as sinon from 'sinon';
import faker from 'faker';
import { AuthController } from '../controllers/auth';

dotenv.config();
chai.use(chaiHttp);
chai.use(chaiAsPromised);

process.env.NODE_ENV = 'test';

describe('Auth', () => {
  let status: any,
    json: any,
    res: any,
    setHeader = () => {};

  beforeEach(async () => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status, setHeader };
    status.returns(res);
  });

  it('should not register a user without/incorrect email', async function () {
    const req = { body: { email: 'test.com' } };
    await new AuthController().signup(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(400);
  });

  it('should not register a user with password len less than  eight char long', async function () {
    const req = {
      body: { email: faker.internet.email(), password: '12345Aa' },
    };
    await new AuthController().signup(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(400);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal(
      'Password should be at least eight characters long'
    );
  });

  it('should register user', async function () {
    const req = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(8),
      },
    };
    await new AuthController().signup(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(201);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('User created successfully');
  });

  it('should not login user not found', async function () {
    const req = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(8),
      },
    };
    await new AuthController().signin(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(401);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].err).to.equal('User not found');
  });

  it('should not login account not verified', async function () {
    const req = {
      body: {
        email: 'dummy@test.com',
        password: '123456Aa',
      },
    };

    await new AuthController().signin(req as Request, res);
    expect(status.args[0][0]).to.equal(403);
    expect(json.args[0][0].err).to.equal(
      'Please confirm your account first before login, we sent you an email confirmation, check your inbox!'
    );
  });
});
