import User from '../../models/user';
import * as dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { TEST_BASE_URL, SECRET_TOKEN } from '../../config/const';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('Reset password', () => {
  const user = new User({
    email: 'testing3g@test.com',
    password: '123456Aa',
    status: 'verified',
  });

  before(async () => {
    await user.save();
  });

  it('should not reset password (wrong format)', async () => {
    chai
      .request(TEST_BASE_URL)
      .post(`/password/reset`)
      .send({ email: 'wrong.com', password: '' })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal('Invalid email format');
      });
  });

  it("should not reset password (user doesn't exist)", async () => {
    chai
      .request(TEST_BASE_URL)
      .post(`/password/reset`)
      .send({ email: 'testing@test.com', password: '123456Aa' })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.msg).to.equal("You don't have permission!");
      });
  });

  it('should reset password', (done) => {
    chai
      .request(TEST_BASE_URL)
      .post(`/password/reset`)
      .send({ email: 'testing3g@test.com', password: '123456Aa' })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).to.equal(201);
        expect(res.body.msg).to.equal('Token created, verify your email!');
        done();
      });
  });
});
