import { Router } from "express";
import { createUser, getAllUsers, createStore , dashboard } from "../controllers/admin.controller";
import authenticate from "../middlewares/auth.middleware";
import isAdmin from "../middlewares/role.middleware";

const router = Router();

// PROTECTED ROUTES
router.use(authenticate);
router.use(isAdmin);

router.route("/user")
    .get(getAllUsers)
    .post(createUser)

router.route("/store")
    .post(createStore)

router.route("/dashboard")
    .get(dashboard)

export default router;