import { usersTable, profileTable, propertyTable, reviewTable } from './schema';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import db from '.';

async function main() {
  console.log('--- Seeding Started ---');

  // 1. Clean existing data (Optional but helpful for development)
  // Note: Order matters due to FK constraints
  await db.delete(reviewTable);
  await db.delete(propertyTable);
  await db.delete(profileTable);
  await db.delete(usersTable);

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Seed Users
  console.log('Seeding users...');
  const users = await db
    .insert(usersTable)
    .values([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        name: 'Agent John',
        email: 'agent@example.com',
        password: hashedPassword,
        role: 'AGENT',
      },
      {
        name: 'Customer Alice',
        email: 'customer@example.com',
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    ])
    .returning();

  const admin = users[0];
  const agent = users[1];
  const customer = users[2];
  if (!admin || !agent || !customer) return;
  else {
    // 3. Seed Profiles
    console.log('Seeding profiles...');
    await db.insert(profileTable).values(
      users.map((u) => ({
        userId: u.id,
        bio: faker.lorem.sentence(),
        birthDate: faker.date.birthdate().toISOString().split('T')[0],
      })),
    );

    // 4. Seed Properties
    console.log('Seeding properties...');
    const properties = await db
      .insert(propertyTable)
      .values([
        {
          name: 'Luxury Villa',
          description: 'A beautiful seaside villa',
          price: '500,000',
          area: '2500 sqft',
          bedrooms: '4',
          bathrooms: '3',
          address: faker.location.streetAddress(),
          agentId: agent.id,
          image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
          galleries: [faker.image.urlLoremFlickr({ category: 'city' })],
          geolocation: { lat: 40.7128, lng: -74.006 },
        },
        {
          name: 'Modern Apartment',
          description: 'Downtown smart apartment',
          price: '200,000',
          area: '1200 sqft',
          bedrooms: '2',
          bathrooms: '2',
          address: faker.location.streetAddress(),
          agentId: agent.id,
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        },
      ])
      .returning();

    // 5. Seed Reviews
    console.log('Seeding reviews...');
    await db.insert(reviewTable).values([
      {
        userId: customer.id,
        propertyId: properties[0]?.id,
        rating: 4.5,
        content: 'Amazing place, very quiet!',
      },
      {
        userId: admin.id,
        propertyId: properties[1]?.id,
        rating: 5,
        content: 'Exceeded all expectations.',
      },
    ]);

    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
