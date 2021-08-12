import User from '../../models/user';
import * as dotenv from 'dotenv';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import { TEST_BASE_URL, SECRET_TOKEN } from '../../config/const';

dotenv.config();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

describe('User', () => {
  let token = '';
  const user = new User({
    email: 'testing2g@test.com',
    password: '123456Aa',
    status: 'verified',
  });

  before(async () => {
    await user.save();
    const usr = await User.findOne({ email: 'testing2g@test.com' });
    token = jwt.sign({ userId: usr?._id }, SECRET_TOKEN, {
      expiresIn: '24h',
    });
  });

  it('should return user', async () => {
    chai
      .request(TEST_BASE_URL)
      .get(`/users/${user?._id}`)
      .auth(token, { type: 'bearer' })
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
      });
  });

  it('should return user not found (id is undefined)', async () => {
    chai
      .request(TEST_BASE_URL)
      .get(`/users/${undefined}`)
      .auth(token, { type: 'bearer' })
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('User not found');
      });
  });

  it('should not update (userName < 3)', async () => {
    chai
      .request(TEST_BASE_URL)
      .patch(`/users/${user?._id}`)
      .auth(token, { type: 'bearer' })
      .send({ firstName: 'Ab', lastName: 'Cde' })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.msg).to.equal(
          `Your first and last name should be at least four characters long!`
        );
      });
  });

  it('should update', async () => {
    chai
      .request(TEST_BASE_URL)
      .patch(`/users/${user?._id}`)
      .auth(token, { type: 'bearer' })
      .send({ firstName: 'James', lastName: 'Bond' })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.msg).to.equal('User Updated successfull');
      });
  });

  it("should not update score (id 42 doesn't exist)", async () => {
    chai
      .request(TEST_BASE_URL)
      .post(`/users/${42}`)
      .auth(token, { type: 'bearer' })
      .send()
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.msg).to.equal('User not found');
      });
  });

  it('should update score', async () => {
    chai
      .request(TEST_BASE_URL)
      .post(`/users/${user?._id}`)
      .auth(token, { type: 'bearer' })
      .send({ level: 2, score: 4242, defeat: 0, victory: 1 })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.msg).to.equal('Score updated successfully');
      });
  });
});
