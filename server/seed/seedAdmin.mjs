import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const roles = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  STORE_OWNER: 'STORE_OWNER',
};

async function main() {
  // Clear old data to avoid conflicts
  await prisma.rating.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});

  // Users to create (with plaintext passwords)
  const usersData = [
    // 1 Admin
    { name: 'Admin Master', email: 'admin@domain.com', password: 'Admin@123', address: '123 Admin St', role: roles.ADMIN },

    // 5 Users
    { name: 'Alice Johnson', email: 'alice@example.com', password: 'Alice@123', address: '101 Maple Ave', role: roles.USER },
    { name: 'Bob Smith', email: 'bob@example.com', password: 'Bob@12345', address: '102 Maple Ave', role: roles.USER },
    { name: 'Charlie Davis', email: 'charlie@example.com', password: 'Charlie@123', address: '103 Maple Ave', role: roles.USER },
    { name: 'Dana Lee', email: 'dana@example.com', password: 'Dana@1234', address: '104 Maple Ave', role: roles.USER },
    { name: 'Eli Walker', email: 'eli@example.com', password: 'Eli@12345', address: '105 Maple Ave', role: roles.USER },

    // 10 Store Owners
    { name: 'Owner One', email: 'owner1@stores.com', password: 'OwnerOne@1', address: '1 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Two', email: 'owner2@stores.com', password: 'OwnerTwo@2', address: '2 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Three', email: 'owner3@stores.com', password: 'OwnerThree@3', address: '3 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Four', email: 'owner4@stores.com', password: 'OwnerFour@4', address: '4 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Five', email: 'owner5@stores.com', password: 'OwnerFive@5', address: '5 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Six', email: 'owner6@stores.com', password: 'OwnerSix@6', address: '6 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Seven', email: 'owner7@stores.com', password: 'OwnerSeven@7', address: '7 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Eight', email: 'owner8@stores.com', password: 'OwnerEight@8', address: '8 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Nine', email: 'owner9@stores.com', password: 'OwnerNine@9', address: '9 Store St', role: roles.STORE_OWNER },
    { name: 'Owner Ten', email: 'owner10@stores.com', password: 'OwnerTen@10', address: '10 Store St', role: roles.STORE_OWNER },
  ];

  // Hash passwords and create users
  const createdUsers = [];
  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        address: user.address,
        role: user.role,
      },
    });
    createdUsers.push(createdUser);
  }

  // Create stores linked to STORE_OWNERs
  const storeOwners = createdUsers.filter(u => u.role === roles.STORE_OWNER);

  const storesData = [
    { name: 'Alpha Store', address: '100 Alpha St', ownerId: storeOwners[0].id },
    { name: 'Beta Store', address: '200 Beta St', ownerId: storeOwners[1].id },
    { name: 'Gamma Store', address: '300 Gamma St', ownerId: storeOwners[2].id },
    { name: 'Delta Store', address: '400 Delta St', ownerId: storeOwners[3].id },
    { name: 'Epsilon Store', address: '500 Epsilon St', ownerId: storeOwners[4].id },
    { name: 'Zeta Store', address: '600 Zeta St', ownerId: storeOwners[5].id },
    { name: 'Eta Store', address: '700 Eta St', ownerId: storeOwners[6].id },
    { name: 'Theta Store', address: '800 Theta St', ownerId: storeOwners[7].id },
    { name: 'Iota Store', address: '900 Iota St', ownerId: storeOwners[8].id },
    { name: 'Kappa Store', address: '1000 Kappa St', ownerId: storeOwners[9].id },
  ];

  const createdStores = [];
  for (const store of storesData) {
    const createdStore = await prisma.store.create({
      data: {
        name: store.name,
        address: store.address,
        ownerId: store.ownerId,
      },
    });
    createdStores.push(createdStore);
  }

  // Create ratings - each user (not admin, not store owner) rates 5 random stores
  const users = createdUsers.filter(u => u.role === roles.USER);
  const storeCount = createdStores.length;

  for (const user of users) {
    // Randomly pick 5 stores to rate
    const storeIndices = new Set();
    while (storeIndices.size < 5) {
      storeIndices.add(Math.floor(Math.random() * storeCount));
    }

    for (const idx of storeIndices) {
      const ratingValue = Math.floor(Math.random() * 5) + 1; // 1 to 5
      await prisma.rating.create({
        data: {
          rating: ratingValue,
          userId: user.id,
          storeId: createdStores[idx].id,
        },
      });
    }
  }

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
