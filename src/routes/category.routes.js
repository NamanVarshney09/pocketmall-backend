import { Router } from "express";
import {
    addCategory,
    updateCategoryDetails,
    fetchAllCategories,
    fetchCategoryByID,
    deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, fetchAllCategories);
router.route("/:id").get(verifyJWT, fetchCategoryByID);
router.route("/add").post(addCategory);
router.route("/update/:id").patch(updateCategoryDetails);
router.route("/delete/:id").delete(deleteCategory);

export default router;
