import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/crypto.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Default Halls
  const halls = [
    {
      id: "hall-gold",
      name: "Oltin Zal",
      capacity: 250,
      pricePerSeat: 150000
    },
    {
      id: "hall-silver",
      name: "Kumush Zal",
      capacity: 180,
      pricePerSeat: 120000
    },
    {
      id: "hall-vip",
      name: "VIP Kichik Zal",
      capacity: 70,
      pricePerSeat: 200000
    }
  ];

  for (const hall of halls) {
    await prisma.hall.upsert({
      where: { id: hall.id },
      update: {
        name: hall.name,
        capacity: hall.capacity,
        pricePerSeat: hall.pricePerSeat
      },
      create: hall
    });
  }
  console.log("Halls seeded successfully.");

  // Default Users
  const defaultUsers = [
    {
      email: "admin@toyxona.uz",
      fullName: "Super Admin",
      phone: "+998901234567",
      password: "adminpassword",
      role: "super_admin"
    },
    {
      email: "manager@toyxona.uz",
      fullName: "Laziz Manager",
      phone: "+998907654321",
      password: "123456",
      role: "manager"
    },
    {
      email: "staff@toyxona.uz",
      fullName: "Jamshid Staff",
      phone: "+998939998877",
      password: "123456",
      role: "staff"
    },
    {
      email: "client@toyxona.uz",
      fullName: "Murod Client",
      phone: "+998971112233",
      password: "123456",
      role: "client"
    }
  ];

  for (const item of defaultUsers) {
    const passwordHash = hashPassword(item.password);
    await prisma.user.upsert({
      where: { email: item.email },
      update: {
        fullName: item.fullName,
        phone: item.phone,
        passwordHash,
        role: item.role
      },
      create: {
        email: item.email,
        fullName: item.fullName,
        phone: item.phone,
        passwordHash,
        role: item.role
      }
    });
  }
  console.log("Users seeded successfully.");
  console.log("Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
