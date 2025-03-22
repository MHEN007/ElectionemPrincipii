import { Elysia } from "elysia";
import { Routes } from "./route";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(Routes)
  .use(cors(
    {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  ))
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
