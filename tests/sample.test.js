import sum from '../main';

describe('Sample', () => {
  test('adds 1 + 2 + 3 to equal 3', () => {
    expect(sum(1, 2, 3)).toBe(6);
  });
});
