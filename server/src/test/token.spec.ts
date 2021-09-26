import User from '../models/user';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { TokenController } from '../controllers/token';
import * as sinon from 'sinon';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Token', () => {
  let status: any, json: any, res: any;
  const user = new User({
    email: 'hell@test.com',
    password: '123456Aa',
    status: 'verified',
  });

  beforeEach(async () => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
  });

  it('should not verify token undefined', async function () {
    const req = {
      query: {
        token: undefined,
      },
    };
    await new TokenController().verify(req as unknown as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(401);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].err).to.equal('Unauthorized');
  });

  it('should not verify fake token', async function () {
    const req = {
      query: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGZmYTk2NTI3MGQ0NWNkM2YyODdiMjAiLCJpYXQiOjE2MjczNjc3ODEsImV4cCI6MTYyNzQ1NDE4MX0.b3SbjjOpLNZXTVrMhDPy1jjHb8_7nsaClCdqA9V2Gq4',
      },
    };
    await new TokenController().verify(req as unknown as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(401);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].err).to.equal("You don't have permission!");
  });

  it('should create token', async function () {
    const req = {
      body: {
        email: 'dummy@test.com',
      },
    };
    await new TokenController().create(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(201);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('Token created, verify your email!');
  });
});
