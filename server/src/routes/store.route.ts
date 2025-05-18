import { Router } from "express";
import authenticate from "../middlewares/auth.middleware";
import { isStoreOwner } from "../middlewares/role.middleware";
import { getAllStores } from "../controllers/store.controller";

const router = Router();

// PROTECTED ROUTES
router.use(authenticate);

router.route("/")
    .get(getAllStores);

router.route("/:storeId")
    .get(isStoreOwner , getAllStores);

export default router;