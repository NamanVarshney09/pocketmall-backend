import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";

const addProduct = asyncHandler(async (req, res) => {
    const { name, description, productImage, price, stock } = req.body;
    try {
        if (
            [name, description, productImage, price, stock].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

        const existedProduct = await Product.findOne({ name });

        if (existedProduct) {
            throw new ApiError(409, "Product with same name already exists");
        }

        const productImageLocalPath = req.file?.path;

        if (!productImageLocalPath) {
            throw new ApiError(400, "Product image not provided");
        }

        const productImageCloudinary = await uploadOnCloudinary(
            productImageLocalPath
        );

        if (!productImageCloudinary) {
            throw new ApiError(400, "Product image not uploaded");
        }

        const product = await Product.create({
            name,
            description,
            productImage: productImageCloudinary?.url || "",
            price,
            stock,
            owner: req.user._id,
            category: "",
        });

        const createdProduct = await Product.findById(product._id);

        if (!createdProduct) {
            throw new ApiError(
                500,
                "Something went wrong while adding the product"
            );
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    createdProduct,
                    "Product added successfully"
                )
            );
    } catch (error) {
        throw new ApiError(500, "Internal Error : Product not added");
    }
});

const updateProductDetails = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, product, "Product details updated"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : Product not updated"
        );
    }
});

const fetchAllProducts = asyncHandler(async (_, res) => {
    try {
        const products = await Product.find()
            .populate("category")
            .populate("owner");
        if (!products) {
            throw new ApiError(500, "Error in fetching products");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, products, "Products fetched"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Error in fetching products");
    }
});

const fetchProductByID = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category")
            .populate("owner");
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    product,
                    `Product ${req.params.id} fetched`
                )
            );
    } catch (error) {
        throw new ApiError(500, error?.message || "Product not found");
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, product, "Product deleted"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Product not found");
    }
});

export {
    addProduct,
    updateProductDetails,
    fetchAllProducts,
    fetchProductByID,
    deleteProduct,
};
