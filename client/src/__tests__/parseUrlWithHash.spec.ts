import parseUrlWithHash from '../utils/parseUrlWithHash';

describe('parseWithHash()', () => {
  test('should return empty array', () => {
    const arr = parseUrlWithHash('https://jestjs.io/docs/tutorial-react');
    expect(arr).toHaveLength(0);
  });

  test('should return a non empty array', () => {
    const arr = parseUrlWithHash('http://localhost:3000/#React[useEffect]');
    expect(arr).toEqual(['React', 'useEffect']);
  });
});
