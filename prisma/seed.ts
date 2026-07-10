import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding started...");

  const hashedPassword = await bcrypt.hash("123456", 10);

  //   data insert here

  const admin = await prisma.user.upsert({
    where: {
      email: "admin1@gmail.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin1@gmail.com",
      password: hashedPassword,
      phone: "01711111111",
      role: "ADMIN",
    },
  });

  const customer1 = await prisma.user.upsert({
    where: {
      email: "rahima@gmail.com",
    },
    update: {},
    create: {
      name: "Rahim",
      email: "rahima@gmail.com",
      password: hashedPassword,
      phone: "01711111112",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.upsert({
    where: {
      email: "jannat@gmail.com",
    },
    update: {},
    create: {
      name: "Jannat Akter",
      email: "jannat@gmail.com",
      password: hashedPassword,
      phone: "01711111116",
      role: "CUSTOMER",
    },
  });

  const customer3 = await prisma.user.upsert({
    where: {
      email: "tanvir@gmail.com",
    },
    update: {},
    create: {
      name: "Tanvir Hasan",
      email: "tanvir@gmail.com",
      password: hashedPassword,
      phone: "01711111117",
      role: "CUSTOMER",
    },
  });

  const techUser1 = await prisma.user.upsert({
    where: {
      email: "hasan@gmail.com",
    },
    update: {},
    create: {
      name: "Hasan Electrician",
      email: "hasan@gmail.com",
      password: hashedPassword,
      phone: "01711111115",
      role: "TECHNICIAN",
    },
  });

  const techUser2 = await prisma.user.upsert({
    where: {
      email: "rakib@gmail.com",
    },
    update: {},
    create: {
      name: "Rakib Plumber",
      email: "rakib@gmail.com",
      password: hashedPassword,
      phone: "01711111118",
      role: "TECHNICIAN",
    },
  });

  const techUser3 = await prisma.user.upsert({
    where: {
      email: "sabbir@gmail.com",
    },
    update: {},
    create: {
      name: "Sabbir Cleaner",
      email: "sabbir@gmail.com",
      password: hashedPassword,
      phone: "01711111119",
      role: "TECHNICIAN",
    },
  });

  const painting = await prisma.category.upsert({
    where: {
      name: "Painting",
    },
    update: {},
    create: {
      name: "Painting",
      description: "Painting services",
    },
  });

  const acRepair = await prisma.category.upsert({
    where: {
      name: "AC Repair",
    },
    update: {},
    create: {
      name: "AC Repair",
      description: "Air conditioner repair",
    },
  });

  const technician1 = await prisma.technician.upsert({
    where: {
      technicianId: techUser1.id,
    },
    update: {},
    create: {
      technicianId: techUser1.id,
      bio: "Professional electrician with 6 years of experience.",
      experience: 6,
      location: "Dhaka",
      skills: ["Wiring", "Switch Repair", "Fan Installation"],
    },
  });

  const technician2 = await prisma.technician.upsert({
    where: {
      technicianId: techUser2.id,
    },
    update: {},
    create: {
      technicianId: techUser2.id,
      bio: "Experienced plumber for residential services.",
      experience: 8,
      location: "Chattogram",
      skills: ["Pipe Repair", "Bathroom Plumbing", "Water Tank Installation"],
    },
  });

  const technician3 = await prisma.technician.upsert({
    where: {
      technicianId: techUser3.id,
    },
    update: {},
    create: {
      technicianId: techUser3.id,
      bio: "Professional cleaning specialist.",
      experience: 5,
      location: "Khulna",
      skills: ["Deep Cleaning", "Office Cleaning", "Sofa Cleaning"],
    },
  });
  const availability1 = await prisma.availability.upsert({
    where: {
      technicianId_day_startTime_endTime: {
        technicianId: technician1.id,
        day: "MONDAY",
        startTime: "09:00",
        endTime: "11:00",
      },
    },
    update: {},
    create: {
      technicianId: technician1.id,
      day: "MONDAY",
      startTime: "09:00",
      endTime: "11:00",
    },
  });

  const availability2 = await prisma.availability.upsert({
    where: {
      technicianId_day_startTime_endTime: {
        technicianId: technician2.id,
        day: "TUESDAY",
        startTime: "10:00",
        endTime: "12:00",
      },
    },
    update: {},
    create: {
      technicianId: technician2.id,
      day: "TUESDAY",
      startTime: "10:00",
      endTime: "12:00",
    },
  });

  const availability3 = await prisma.availability.upsert({
    where: {
      technicianId_day_startTime_endTime: {
        technicianId: technician3.id,
        day: "FRIDAY",
        startTime: "02:00",
        endTime: "04:00",
      },
    },
    update: {},
    create: {
      technicianId: technician3.id,
      day: "FRIDAY",
      startTime: "02:00",
      endTime: "04:00",
    },
  });

  const service1 = await prisma.service.upsert({
    where: {
      technicianId_title: {
        technicianId: technician1.id,
        title: "Wall Painting",
      },
    },
    update: {},
    create: {
      title: "Wall Painting",
      description: "Professional interior wall painting.",
      price: 3000,
      duration: 180,
      technicianId: technician1.id,
      categoryId: painting.id,
    },
  });

  const service2 = await prisma.service.upsert({
    where: {
      technicianId_title: {
        technicianId: technician2.id,
        title: "Pipe Leakage Repair",
      },
    },
    update: {},
    create: {
      title: "Pipe Leakage Repair",
      description: "Fix leaking water pipes.",
      price: 1200,
      duration: 90,
      technicianId: technician2.id,
      categoryId: acRepair.id,
    },
  });

  const service3 = await prisma.service.upsert({
    where: {
      technicianId_title: {
        technicianId: technician3.id,
        title: "AC Servicing",
      },
    },
    update: {},
    create: {
      title: "AC Servicing",
      description: "Complete AC servicing and cleaning.",
      price: 2000,
      duration: 120,
      technicianId: technician3.id,
      categoryId: acRepair.id,
    },
  });

  const booking1 = await prisma.booking.upsert({
    where: {
      availabilityId: availability1.id,
    },
    update: {},
    create: {
      customerId: customer1.id,
      technicianId: technician1.id,
      serviceId: service1.id,
      availabilityId: availability1.id,
      note: "Need bedroom wall painting.",
      totalPrice: 3000,
      status: "COMPLETED",
    },
  });

  const booking2 = await prisma.booking.upsert({
    where: {
      availabilityId: availability2.id,
    },
    update: {},
    create: {
      customerId: customer2.id,
      technicianId: technician2.id,
      serviceId: service2.id,
      availabilityId: availability2.id,
      note: "Kitchen pipe is leaking.",
      totalPrice: 1200,
      status: "ACCEPTED",
    },
  });

  const booking3 = await prisma.booking.upsert({
    where: {
      availabilityId: availability3.id,
    },
    update: {},
    create: {
      customerId: customer3.id,
      technicianId: technician3.id,
      serviceId: service3.id,
      availabilityId: availability3.id,
      note: "Need AC servicing before summer.",
      totalPrice: 2000,
      status: "PENDING",
    },
  });

  await prisma.review.upsert({
    where: {
      bookingId: booking1.id,
    },
    update: {},
    create: {
      customerId: customer1.id,
      technicianId: technician1.id,
      bookingId: booking1.id,
      rating: 5,
      comment: "Excellent service. Highly recommended.",
    },
  });

  console.log("Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  });
