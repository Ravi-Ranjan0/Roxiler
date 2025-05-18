import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router();

router.route("/")
    .post(registerUser);

export default router;