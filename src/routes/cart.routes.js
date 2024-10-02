import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").get(verifyJWT, getCart);
router.route("/").post(verifyJWT, addItemToCart);
router.route("/").delete(verifyJWT, removeItemFromCart);

export default router;
