import { padNumber } from '_utils';

// example starter of how to test a standard JS method using Jest
test('returns a string', () => {

  expect(padNumber(23)).toBe('23');

});

test('adds a leading zero to a number less than 9', () => {

  expect(padNumber(2)).toBe('02');

});

test(`doesn't add a leading zero to a number greater than 9`, () => {

  expect(padNumber(14)).toBe('14');

});
