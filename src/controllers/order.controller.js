import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";

// POST /orders
const createOrder = asyncHandler(async (req, res) => {
    try {
        const { orderPrice, orderItems, address, status } = req.body;

        if (!orderItems || orderItems.length === 0) {
            throw new ApiError(400, "No order items provided");
        }

        if (
            [orderPrice, orderItems, address, status].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

        const order = await Order.create({
            orderPrice,
            customer:req.user?._id,
            orderItems,
            address,
            status,
        });

        const createdOrder = await Order.findById(order._id);

        if (!createdOrder) {
            throw new ApiError(
                500,
                "Something went wrong while creating the order"
            );
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    createdCategory,
                    "Order created successfully"
                )
            );
    } catch (error) {
        throw new ApiError(500, "Internal Error : Order not created");
    }
});

// PATCH /orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { status } = req.body;

        if (!["PENDING", "CANCELLED", "DELIVERED"].includes(status)) {
            throw new ApiError(400, "Invalid order status");
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            throw new ApiError(404, "Order not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, updatedOrder, "Order status updated"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : Order status not updated"
        );
    }
});

// PUT /orders/:id
const updateOrderDetails = asyncHandler(async (req, res) => {
    try {
        const { orderPrice, orderItems, address, status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { orderPrice, orderItems, address, status },
            { new: true }
        );
        if (!updatedOrder) {
            throw new ApiError(404, "Order not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, updatedOrder, "Order details updated"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : Order details not updated"
        );
    }
});

// GET /orders - useful for an admin dashboard
const fetchAllOrders = asyncHandler(async (_, res) => {
    try {
        const orders = await Order.find()
            .populate("customer")
            .populate("orderItems.product");
        if (!orders) {
            throw new ApiError(500, "Error in fetching orders");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, orders, "Orders fetched"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : orders not fetched"
        );
    }
});

// GET /orders/:id
const fetchOrderByID = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer")
            .populate("orderItems.product");

        if (!order) {
            throw new ApiError(404, "Order not found");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, order, `Order ${req.params.id} fetched`)
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : Category not found"
        );
    }
});

// GET /orders/customer/:customerId
const fetchOrderByCustomers = asyncHandler(async (req, res) => {
    try {
        const { customerId } = req.params;
        const orders = await Order.find({ customer: customerId }).populate(
            "orderItems.product"
        );

        if (!orders && orders.length === 0) {
            throw new ApiError(404, "No orders found for this customer");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    orders,
                    `Orders for customer ${customerId} fetched`
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : Orders not found"
        );
    }
});

// DELETE /orders/:id
const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            throw new ApiError(404, "Order not found");
        }
        return res
            .status(200)
            .json(new ApiResponse(200, deletedOrder, "Order deleted"));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Internal Error : Order not deleted"
        );
    }
});

export {
    createOrder,
    updateOrderDetails,
    fetchAllOrders,
    fetchOrderByID,
    fetchOrderByCustomers,
    deleteOrder,
    updateOrderStatus,
};
