import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";

const getCart = asyncHandler(async (_, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );
        if (!cart) {
            throw new ApiError(500, "Error in fetching cart");
        }
        return res.status(200).json(new ApiResponse(200, cart, "Cart fetched"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : cart not fetched"
        );
    }
});

const addItemToCart = asyncHandler(async (req, res) => {
    try {
        const { product, quantity } = req.body;

        if ([product, quantity].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            const createdCart = await Cart.create({
                user: req.user._id,
                items: [{ product, quantity }],
            });
            return res
                .status(200)
                .json(new ApiResponse(200, createdCart, "Item added in cart"));
        }
        // If cart exists, update it
        const itemIndex = cart.items.findIndex((item) =>
            item.product.equals(product)
        );
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product, quantity });
        }

        return res
            .status(200)
            .json(new ApiResponse(200, cart, "Item added in cart"));
    } catch (error) {
        throw new ApiError(500, "Internal Error : Item not added");
    }
});

const removeItemFromCart = asyncHandler(async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            throw new ApiError(404, "Cart not found");
        }

        const updatedCart = await Cart.findByIdAndUpdate(
            cart._id,
            {
                items: cart.items.filter(
                    (item) => !item.product.equals(req.body.product)
                ),
            },
            {
                new: true,
            }
        );

        return res
            .status(200)
            .json(new ApiResponse(200, updatedCart, "Item removed from cart"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Cart not found");
    }
});

export { getCart, addItemToCart, removeItemFromCart };
