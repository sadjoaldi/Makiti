import { PrismaClient } from '.prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Categories ───────────────────────────────────────────
  const categories = [
    { name: 'Électronique', slug: 'electronique', icon: '📱', order: 1 },
    { name: 'Alimentation', slug: 'alimentation', icon: '🍎', order: 2 },
    { name: 'Véhicules', slug: 'vehicules', icon: '🚗', order: 3 },
    { name: 'Immobilier', slug: 'immobilier', icon: '🏠', order: 4 },
    { name: 'Mode & Vêtements', slug: 'mode-vetements', icon: '👗', order: 5 },
    { name: 'Maison & Jardin', slug: 'maison-jardin', icon: '🛋️', order: 6 },
    { name: 'Services', slug: 'services', icon: '🔧', order: 7 },
    { name: 'Emploi', slug: 'emploi', icon: '💼', order: 8 },
    { name: 'Sports & Loisirs', slug: 'sports-loisirs', icon: '⚽', order: 9 },
    { name: 'Autres', slug: 'autres', icon: '📦', order: 10 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { order: category.order, icon: category.icon },
      create: category,
    });
  }

  console.log(`✅ ${categories.length} catégories créées`);

  // ─── Admin ────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'change_this_password',
    10,
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@makiti.com' },
    update: {
      password: adminPassword,
    },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@makiti.com',
      phone: process.env.ADMIN_PHONE || '+224600000000',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Makiti',
      city: 'Conakry',
      isVerified: true,
      isAdmin: true,
    },
  });

  console.log(`✅ Admin créé : ${admin.email}`);
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
