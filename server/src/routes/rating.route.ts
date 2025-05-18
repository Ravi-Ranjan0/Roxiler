import { Router } from "express";
import authenticate from "../middlewares/auth.middleware";
import { getAllRatings, getStoreRating, giveRating, modifyRating } from "../controllers/rating.controller";

const router = Router();

router.use(authenticate);

router.route("/")
    .get(getAllRatings)
    .post(giveRating)
    .put(modifyRating);

router.route("/:storeId")
    .get(getStoreRating);

export default router;