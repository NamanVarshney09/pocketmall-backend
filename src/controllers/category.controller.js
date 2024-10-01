import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";

const addCategory = asyncHandler(async (req, res) => {
    const { name, color } = req.body;
    try {
        if ([name, color].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const existedCategory = await Category.findOne({ name });

        if (existedCategory) {
            throw new ApiError(409, "Category with same name already exists");
        }

        const category = await Category.create({ name, color });

        const createdCategory = await Category.findById(category._id);

        if (!createdCategory) {
            throw new ApiError(
                500,
                "Something went wrong while adding the category"
            );
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    createdCategory,
                    "Category added successfully"
                )
            );
    } catch (error) {
        throw new ApiError(500, "Internal Error : Category not added");
    }
});

const updateCategoryDetails = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, category, "Category details updated"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : Category not updated"
        );
    }
});

const fetchAllCategories = asyncHandler(async (_, res) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            throw new ApiError(500, "Error in fetching categories");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, categories, "Categories fetched"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : categories not fetched"
        );
    }
});

const fetchCategoryByID = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    category,
                    `Category ${req.params.id} fetched`
                )
            );
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Error : Category not found");
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, category, "Category deleted"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Category not found");
    }
});

export {
    addCategory,
    updateCategoryDetails,
    fetchAllCategories,
    fetchCategoryByID,
    deleteCategory,
};
