import { Elysia } from "elysia";
import { Routes } from "./route";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(Routes)
  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
