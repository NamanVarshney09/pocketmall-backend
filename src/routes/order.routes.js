import { Router } from "express";
import {
    createOrder,
    updateOrderDetails,
    fetchAllOrders,
    fetchOrderByID,
    fetchOrderByCustomers,
    deleteOrder,
    updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createOrder);
router.route("/").get(verifyJWT, fetchAllOrders);
router.route("/:id").get(verifyJWT, fetchOrderByID);
router.route("/customer/:customerID").get(verifyJWT, fetchOrderByCustomers);
router.route("/:id/status").patch(verifyJWT, updateOrderStatus);
router.route("/update/:id").put(updateOrderDetails);
router.route("/delete/:id").delete(deleteOrder);

export default router;
