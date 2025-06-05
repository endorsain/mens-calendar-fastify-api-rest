// TODO: Importante leer.
// 400 - Bad Request (datos inválidos)
// 401 - Unauthorized (sin autenticación)
// 403 - Forbidden (sin permisos)
// 404 - Not Found (recurso no existe)
// 409 - Conflict (duplicado, ej: email existente)
// 422 - Unprocessable Entity (validación fallida)
// 500 - Internal Server Error (error del servidor)

import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const fastify = Fastify({
  logger: true,
});

const prisma = new PrismaClient();

fastify.get("/api/users", async (request, reply) => {
  const users = await prisma.user.findMany();

  console.log("GET - users: ", users);

  return {
    users,
  };
});

// POST con tipado
interface CreateUserBody {
  email: string;
  password: string;
}

fastify.post<{ Body: CreateUserBody }>("/api/users", async (request, reply) => {
  const { email, password } = request.body;
  console.log("email: ", email, "password: ", password);

  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });

  return {
    success: true,
    user,
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on port 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
