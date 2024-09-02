"use server";
import { revalidatePath } from "next/cache";
import Order from "../models/Order";
import { connectToDatabase } from "../mongoDB";

interface createOrderParams {
  name: String;
  color: String;
  size: String;
  quantity: Number;
  shippingAdress: String;
  city: String;
  phone: String;
  totalAmount: Number;
}
export async function createOrder(params: createOrderParams) {
  try {
    connectToDatabase();

    const {
      name,
      shippingAdress,
      city,
      phone,
      color,
      size,
      quantity,
      totalAmount,
    } = params;

    
    const newOrder = new Order({
      name,
      shippingAdress,
      city,
      phone,
      color,
      size,
      quantity,
      totalAmount,
    });

    await newOrder.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export interface GetOrdersParams {
  page?: number;
  pageSize?: number | "all"; // Allow "all" as a value for pageSize
  filter?: string;
}
export async function getOrders(params: GetOrdersParams) {
  try {
    await connectToDatabase();

    const { page = 1, pageSize = 10, filter } = params;

    // Create a query object
    const query = filter ? { status: filter } : {};

    let orders;
    let totalOrders;

    if (pageSize === "all") {
      // Fetch all orders without pagination
      orders = await Order.find(query).sort({ createdAt: -1 });
      totalOrders = orders.length;
      return JSON.parse(JSON.stringify({ orders, isNext: false, totalOrders }));
    } else {
      // Calculate the number of orders to skip based on the page number and page size
      const skipAmount = (page - 1) * pageSize;

      // Fetch orders with pagination
      orders = await Order.find(query)
        .skip(skipAmount)
        .limit(pageSize)
        .sort({ createdAt: -1 });

      // Get the total number of orders for pagination
      totalOrders = await Order.countDocuments(query);
      const  isNext = totalOrders > skipAmount + orders.length;
      return JSON.parse(JSON.stringify({ orders, isNext, totalOrders }));
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface UpdateOrderStatusParams {
  orderId: string;
  newStatus: string;
  path: string;
}

export async function updateOrderStatus(params: UpdateOrderStatusParams) {
  try {
    connectToDatabase();

    const { orderId, newStatus, path } = params;

    // Update the order's status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true } // Return the updated document
    );
    console.log({ updatedOrder });

    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface UpdateOrderStatusesParams {
  orderIds: string[];  // Changed to an array to handle multiple orders
  newStatus: string;
  path: string;
}

export async function updateOrderStatuses(params: UpdateOrderStatusesParams) {
  try {
    await connectToDatabase();

    const { orderIds, newStatus, path } = params;

    // Update the status of all orders with the given IDs
    const updatedOrders = await Order.updateMany(
      { _id: { $in: orderIds } },
      { status: newStatus },
      { new: true }
    );


    if (!updatedOrders) {
      throw new Error("No orders were updated");
    }

    // Revalidate the path to reflect changes
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}


interface UpdateOrderParams {
  orderId: string;
  color: String;
  size: String;
  shippingAdress: String;
  city: String;
  path: string;
}
export async function UpdateOrder(params: UpdateOrderParams) {
  try {
    connectToDatabase();

    const { orderId, shippingAdress, city, color, size, path } = params;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      shippingAdress,
      city,
      color,
      size,
    });
    if (!updatedOrder) {
      throw new Error("field update the order");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
