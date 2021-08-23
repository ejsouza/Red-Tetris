import { tokenExpired } from '../utils/dates';

describe('tokenExpired()', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGVhYWRlMzE0MDRiMzBjOGU0N2ZiYTciLCJpYXQiOjE2MjY1Mjk3NjEsImV4cCI6MTYyNjUzMDc2MX0.OZsBbWpUzCcsn4jUFKufbb2U72lVd9XJ0CE0yCsDMSE';
  it('should return true (tokenExpired)', () => {
    expect(tokenExpired(token)).toBe(true);
  });
});
