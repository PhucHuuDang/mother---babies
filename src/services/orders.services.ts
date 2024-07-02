import { OrderModel } from "../schema";

export const getAllOrders = () => OrderModel.find();

export const getOrderById = (id: string) => OrderModel.findById;

export const getOrderByUserId = (userId: string) => OrderModel.find({ userId });

export const createOrder = (values: Record<string, any>) =>
  new OrderModel(values).save().then((order) => order.toObject());

export const deleteOrderById = (id: string) =>
  OrderModel.findByIdAndDelete({ _id: id });

export const updateOrderById = (id: string, values: Record<string, any>) =>
  OrderModel.findByIdAndUpdate(id, values);
