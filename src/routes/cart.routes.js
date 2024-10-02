import { Router } from "express";
import {
    getCart,
    addItemToCart,
    removeItemFromCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getCart);
router.route("/").post(verifyJWT, addItemToCart);
router.route("/").delete(verifyJWT, removeItemFromCart);

export default router;
