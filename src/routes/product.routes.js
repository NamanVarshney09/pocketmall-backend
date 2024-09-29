import { Router } from "express";
import {
    addProduct,
    updateProductDetails,
    getAllProducts,
    getProductByID,
    deleteProduct,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, getAllProducts);
router.route("/:id").get(verifyJWT, getProductByID);

router.route("/add").post(
    verifyJWT,
    upload.fields([
        {
            name: "productImage",
            maxCount: 1,
        },
    ]),
    addProduct
);

router.route("/update/:id").patch(verifyJWT, updateProductDetails);
router.route("/delete/:id").delete(verifyJWT, deleteProduct);

export default router;
