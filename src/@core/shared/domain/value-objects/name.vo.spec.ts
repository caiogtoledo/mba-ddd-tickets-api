import { Name } from './name.vo';

test('should create a valid Name value object', () => {
  const name = Name.create('John Doe');
  expect(name.value).toBe('John Doe');
});
