import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "123456";

const seedUsers = [
  { email: "admin@toyxona.uz", fullName: "Super Admin", role: "super_admin" },
  { email: "manager@toyxona.uz", fullName: "Manager", role: "manager" },
  { email: "staff@toyxona.uz", fullName: "Staff", role: "staff" },
  { email: "client@toyxona.uz", fullName: "Client", role: "client" }
];

const seedHalls = [
  { name: "Asosiy zal", capacity: 500, pricePerSeat: 120000 },
  { name: "Banket zali", capacity: 250, pricePerSeat: 90000 }
];

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { fullName: user.fullName, role: user.role, passwordHash },
      create: { ...user, passwordHash }
    });
  }

  const hallCount = await prisma.hall.count();
  if (hallCount === 0) {
    for (const hall of seedHalls) {
      await prisma.hall.create({ data: hall });
    }
  }

  console.log(`Seed tugadi. ${seedUsers.length} foydalanuvchi tayyor. Default parol: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
