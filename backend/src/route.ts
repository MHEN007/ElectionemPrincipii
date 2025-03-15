import Elysia from "elysia";

import { CandidateController } from "./controller/candidate.controller";

const routes = new Elysia({ prefix: "/v1/api" })
    .use(CandidateController);

export { routes as Routes };