import { EventSection } from '../event-section';
import { Event } from '../event.entity';
import { PartnerId } from '../partner.entity';

test('should create an event', () => {
  const event = Event.create({
    name: 'Test Event',
    description: 'This is a test event',
    date: new Date('2023-10-01'),
    partner_id: new PartnerId('f9eb93a0-c07a-4f7d-b0ff-6bb2f42c752a'),
  });

  event.addSection({
    name: 'Test Section',
    description: 'This is a test section',
    total_spots: 100,
    price: 50,
  });

  expect(event).toBeInstanceOf(Event);
  expect(event.name).toBe('Test Event');
  expect(event.description).toBe('This is a test event');
  expect(event.date).toEqual(new Date('2023-10-01'));
  expect(event.is_published).toBe(false);
  expect(event.total_spots).toBe(100);
  const [section] = event.sections;
  expect(section.spots?.size ?? 0).toBe(100);
  expect(event.total_spots_reserved).toBe(0);
  expect(event.partner_id.value).toBe('f9eb93a0-c07a-4f7d-b0ff-6bb2f42c752a');
});

test('should publish all itens of event', () => {
  const event = Event.create({
    name: 'Test Event',
    description: 'This is a test event',
    date: new Date('2023-10-01'),
    partner_id: new PartnerId('f9eb93a0-c07a-4f7d-b0ff-6bb2f42c752a'),
  });

  event.addSection({
    name: 'Test Section 1',
    description: 'This is a test section',
    total_spots: 100,
    price: 50,
  });

  event.addSection({
    name: 'Test Section 2',
    description: 'This is a test section',
    total_spots: 100,
    price: 50,
  });

  event.publishAll();

  expect(event.is_published).toBe(true);
  const [section1, section2] = event.sections;
  expect(section1.is_published).toBe(true);
  expect(section2.is_published).toBe(true);

  [...(section1.spots ?? []), ...(section2.spots ?? [])].forEach((spot) => {
    expect(spot.is_published).toBe(true);
  });
});
