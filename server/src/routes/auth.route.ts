import { Router } from "express";
import { signup, login, logout , changePassword } from "../controllers/auth.controller";
import authenticate from "../middlewares/auth.middleware";

const router = Router();

router.route("/login")
    .post(login);

router.route("/signup")
    .post(signup);

// PROTECTED ROUTES
router.use(authenticate);

router.route("/logout")
    .post(logout)

router.route("/change-password")
    .put(changePassword);


export default router;