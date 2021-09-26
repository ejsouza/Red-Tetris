import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import { sendMail, sendResetPasswordMailToken } from '../core/email';
import assert from 'assert';

describe('Email', () => {
  it('should return false (sendMail)', () => {
    assert.strictEqual(sendMail('', ''), false);
  });

  it('should return false (sendResetPasswordMailToken)', () => {
    assert.strictEqual(sendResetPasswordMailToken('', '', ''), false);
  });
});
