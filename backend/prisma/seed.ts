import { PrismaClient } from '.prisma/client';

import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Categories ───────────────────────────────────────────

  const categories = [
    { name: 'Électronique', slug: 'electronique', icon: '📱' },
    { name: 'Véhicules', slug: 'vehicules', icon: '🚗' },
    { name: 'Immobilier', slug: 'immobilier', icon: '🏠' },
    { name: 'Mode & Vêtements', slug: 'mode-vetements', icon: '👗' },
    { name: 'Maison & Jardin', slug: 'maison-jardin', icon: '🛋️' },
    { name: 'Sports & Loisirs', slug: 'sports-loisirs', icon: '⚽' },
    { name: 'Emploi', slug: 'emploi', icon: '💼' },
    { name: 'Services', slug: 'services', icon: '🔧' },
    { name: 'Animaux', slug: 'animaux', icon: '🐾' },
    { name: 'Autres', slug: 'autres', icon: '📦' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`✅ ${categories.length} catégories créées`);

  // ─── Admin User ───────────────────────────────────────────

  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@makiti.com' },
    update: {},
    create: {
      email: 'admin@makiti.com',
      phone: '+224600000000',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Makiti',
      city: 'Conakry',
      isVerified: true,
      isAdmin: true,
    },
  });

  console.log(`✅ Admin créé : ${admin.email}`);

  // ─── Test User ────────────────────────────────────────────

  const userPassword = await bcrypt.hash('test123', 10);

  const testUser = await prisma.user.upsert({
    where: { email: 'test@makiti.com' },
    update: {},
    create: {
      email: 'test@makiti.com',
      phone: '+224620000001',
      password: userPassword,
      firstName: 'Mamadou',
      lastName: 'Diallo',
      city: 'Conakry',
      district: 'Kaloum',
      isVerified: true,
    },
  });

  console.log(`✅ User test créé : ${testUser.email}`);

  // ─── Listings de test ─────────────────────────────────────

  const electronique = await prisma.category.findUnique({
    where: { slug: 'electronique' },
  });

  const vehicules = await prisma.category.findUnique({
    where: { slug: 'vehicules' },
  });

  if (electronique && vehicules) {
    const listings = [
      {
        title: 'iPhone 14 Pro Max 256Go',
        slug: 'iphone-14-pro-max-256go',
        description:
          'iPhone 14 Pro Max en très bon état, batterie à 92%, vendu avec chargeur et coque de protection.',
        price: 4500000,
        city: 'Conakry',
        district: 'Kaloum',
        condition: 'USED' as const,
        categoryId: electronique.id,
        userId: testUser.id,
      },
      {
        title: 'Samsung Galaxy S23 Ultra',
        slug: 'samsung-galaxy-s23-ultra',
        description:
          'Samsung Galaxy S23 Ultra neuf sous blister, jamais utilisé, garantie constructeur.',
        price: 3800000,
        city: 'Conakry',
        district: 'Ratoma',
        condition: 'NEW' as const,
        categoryId: electronique.id,
        userId: testUser.id,
      },
      {
        title: 'Toyota Corolla 2019',
        slug: 'toyota-corolla-2019',
        description:
          'Toyota Corolla 2019, climatisée, kilométrage 45000km, première main, très bon état général.',
        price: 85000000,
        city: 'Conakry',
        district: 'Dixinn',
        condition: 'USED' as const,
        categoryId: vehicules.id,
        userId: testUser.id,
      },
    ];

    for (const listing of listings) {
      await prisma.listing.upsert({
        where: { slug: listing.slug },
        update: {},
        create: listing,
      });
    }

    console.log(`✅ ${listings.length} annonces de test créées`);
  }

  console.log('🎉 Seed terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
