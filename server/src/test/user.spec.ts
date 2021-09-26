import { Request } from 'express';
import * as dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as sinon from 'sinon';
import { UserController } from '../controllers/user';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('User', () => {
  let status: any, json: any, res: any;

  beforeEach(async () => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
  });

  it('should not get user object', async function () {
    const req = { params: { id: undefined } };
    await new UserController().profile(req as unknown as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(404);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('User not found');
  });

  it('should get empty user object with wrong id', async function () {
    const req = { params: { id: '614ef585696ba2004eee6293' } };
    await new UserController().profile(req as unknown as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(200);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('');
  });

  it('should not update user with first/lastName less than 3 characters', async function () {
    const req = {
      params: {
        id: '614ef585696ba2004eee6293',
      },
      body: {
        firstName: 'James',
        lastName: 'Bo',
      },
    };
    await new UserController().update(req as unknown as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(400);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal(
      'Your first and last name should be at least four characters long!'
    );
  });

  it('should mock update user', async function () {
    const req = {
      params: {
        id: '614ef585696ba2004eee6293',
      },
      body: {
        firstName: 'James',
        lastName: 'Bond',
      },
    };
    await new UserController().update(req as unknown as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(201);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('User Updated successfull');
  });

  it('should not update score, id is undefined', async function () {
    const req = {
      params: {
        id: undefined,
      },
      body: {
        playedGames: 2,
        victory: 42,
        defeat: 0,
        bestScore: 4242,
        bestLevel: 4,
      },
    };
    await new UserController().profile(req as unknown as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(404);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].msg).to.equal('User not found');
  });
});
