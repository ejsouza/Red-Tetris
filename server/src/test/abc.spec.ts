import User from '../models/user';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import * as sinon from 'sinon';
import { DB } from '../db';
import { TEST_BASE_URL } from '../config/const';
import { TokenController } from '../controllers/token';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Initialize dummy data', () => {
  const conn = new DB();
  let token = '';
  const user = new User({
    email: 'dummy@test.com',
    password: '123456Aa',
    status: 'pending',
  });

  before((done) => {
    chai
      .request(TEST_BASE_URL)
      .post('/auth/signup')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        done();
      });
  });

  let status: any, json: any, res: any;

  beforeEach(async () => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
  });

  it('should initialize dummy data', async function () {
    const req = {
      body: {
        email: 'dummy@test.com',
      },
    };

    await new TokenController().create(req as Request, res);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(201);
  });
});
