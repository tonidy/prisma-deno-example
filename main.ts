// import { PrismaClient } from "./generated/client/index.js";
// Prisma cannot uses ESM, see https://github.com/prisma/prisma/issues/4816
// This is a workaround, see https://github.com/prisma/prisma/issues/5030#issuecomment-2415199176
import { createRequire } from "node:module";
import { type PrismaClient as PrismaClientType } from "./generated/client/index.d.ts";
import { Application, Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";

const require = createRequire(import.meta.url);
export const Prisma = require("./generated/client/index.js");
/**
 * Initialize.
 */

const prisma: PrismaClientType = new Prisma.PrismaClient({
  log: ["query", "info", "warn", "error"],
});
const app = new Application();
const router = new Router();

/**
 * Setup routes.
 */

router
  .get("/", (context) => {
    context.response.body = "Welcome to the Dinosaur API!";
  })
  .get("/dinosaur", async (context) => {
    // Get all dinosaurs.
    const dinosaurs = await prisma.dinosaur.findMany();
    context.response.body = dinosaurs;
  })
  .get("/dinosaur/:id", async (context) => {
    // Get one dinosaur by id.
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.findUnique({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  })
  .post("/dinosaur", async (context) => {
    const body = context.request.body; // Get the body object
  if (body.type() === "json") { // Ensure the body type is JSON
    const { name, description } = await body.json(); // Extract data from the parsed JSON
    const result = await prisma.dinosaur.create({
      data: {
        name,
        description,
      },
    });
    context.response.body = result; // Respond with the created record
  } else {
    context.response.status = 400; // Bad Request
    context.response.body = { error: "Invalid content type, expected JSON." };
  }
  })
  .delete("/dinosaur/:id", async (context) => {
    // Delete a dinosaur by id.
    const { id } = context.params;
    const dinosaur = await prisma.dinosaur.delete({
      where: {
        id: Number(id),
      },
    });
    context.response.body = dinosaur;
  });

/**
 * Setup middleware.
 */

app.use(router.routes());
app.use(router.allowedMethods());

/**
 * Start server.
 */

await app.listen({ port: 8000 });
