import { Router } from "express";
import {
    addProduct,
    updateProductDetails,
    fetchAllProducts,
    fetchProductByID,
    deleteProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, fetchAllProducts);
router.route("/:id").get(verifyJWT, fetchProductByID);

router.route("/add").post(upload.single("productImage"), addProduct);

router.route("/update/:id").patch(updateProductDetails);
router.route("/delete/:id").delete(deleteProduct);

export default router;
