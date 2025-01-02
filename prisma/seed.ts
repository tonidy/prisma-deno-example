import { createRequire } from "node:module";
// import { PrismaClient } from "../generated/client/index.js";
import { type PrismaClient as PrismaClientType } from "../generated/client/index.d.ts";

const require = createRequire(import.meta.url);
export const Prisma = require("../generated/client/index.js");

const prisma: PrismaClientType = new Prisma.PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const dinosaurData = [
  {
    name: "Aardonyx",
    description: "An early stage in the evolution of sauropods.",
  },
  {
    name: "Abelisaurus",
    description: "Abel's lizard has been reconstructed from a single skull.",
  },
  {
    name: "Acanthopholis",
    description: "No, it's not a city in Greece.",
  },
];

/**
 * Seed the database.
 */
async function seedDatabase() {
  for (const u of dinosaurData) {
    const dinosaur = await prisma.dinosaur.create({
      data: u,
    });
    console.log(`Created dinosaur with id: ${dinosaur.id}`);
  }
  console.log(`Seeding finished.`);
  await prisma.$disconnect();
}

seedDatabase().catch((e) => {
  console.error("Error seeding database:", e);
  prisma.$disconnect();
  Deno.exit(1);
});