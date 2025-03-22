import Elysia from "elysia";

import { CandidateController } from "./controller/candidate.controller";
import { VoteController } from "./controller/vote.controller";
import { AuthController } from "./controller/auth.controller";

const routes = new Elysia({ prefix: "/v1/api" })
    .use(CandidateController)
    .use(VoteController)
    .use(AuthController);

export { routes as Routes };