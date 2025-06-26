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

  const section = EventSection.create({
    name: 'Test Section',
    description: 'This is a test section',
    total_spots: 100,
    price: 50,
  });

  //   event.addSection(section);
  event.sections.add(section);

  expect(event).toBeInstanceOf(Event);
  expect(event.name).toBe('Test Event');
  expect(event.description).toBe('This is a test event');
  expect(event.date).toEqual(new Date('2023-10-01'));
  expect(event.is_published).toBe(false);
  expect(event.total_spots).toBe(0);
  expect(event.total_spots_reserved).toBe(0);
  expect(event.partner_id.value).toBe('f9eb93a0-c07a-4f7d-b0ff-6bb2f42c752a');
});
