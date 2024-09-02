import mongoose, { Schema } from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true
        }
    }
)

const orderSchema = new mongoose.Schema(
    {
        orderPrice: {
            type: Number,
            required: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        orderItems: {
            type: [orderItemSchema]
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING", "CANCELLED", "DELIVERED"],
            default: "PENDING",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Order", orderSchema);