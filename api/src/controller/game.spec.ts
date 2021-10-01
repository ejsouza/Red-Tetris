import chai from 'chai';
import chaiHttp from 'chai-http';
let assert = require('assert');
import { gameDifficulty } from './GameController';

chai.use(chaiHttp);

describe('Game Controller', () => {
  it('should return 420 (recruit)', () => {
    assert.equal(gameDifficulty('recruit'), (700 * 60) / 100);
  });
  it('should return 300 (veteran)', () => {
    assert.equal(gameDifficulty('veteran'), (500 * 60) / 100);
  });
  it('should return 180 (hardcore)', () => {
    assert.equal(gameDifficulty('hardcore'), (300 * 60) / 100);
  });
  it('should return 60 (insane)', () => {
    assert.equal(gameDifficulty('insane'), (100 * 60) / 100);
  });
});
