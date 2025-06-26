import { Partner } from '../partner.entity';

test('should create an event by partner', () => {
  const partner = Partner.create({
    name: 'Test Partner',
  });

  const event = partner.initEvent({
    name: 'Test Event',
    description: 'This is a test event',
    date: new Date('2023-10-01'),
  });

  expect(partner).toBeInstanceOf(Partner);
  expect(partner.name).toBe('Test Partner');
  expect(event).toBeInstanceOf(Object);
  expect(event.name).toBe('Test Event');
  expect(event.description).toBe('This is a test event');
  expect(event.date).toEqual(new Date('2023-10-01'));
  expect(event.is_published).toBe(false);
  expect(event.total_spots).toBe(0);
  expect(event.total_spots_reserved).toBe(0);
  expect(event.partner_id.value).toBe(partner.id.value);
});
