import express from "express";
import {
  createVoucher,
  deleteVoucherById,
  deleteVoucherFromUser,
  getAllVouchers,
  getUserByVoucherId,
  getVoucherByCode,
  getVoucherById,
  updateVoucherById,
  updateVoucherFromUser,
} from "../services";
import { IUser, IVoucher, RequestVoucher } from "../schema";
export const getVouchers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const query = req.query.query as string;

    const { vouchers, totalPages } = await getAllVouchers(query, page, limit);

    if (vouchers.length === 0 || !vouchers) {
      return res
        .status(200)
        .json({ message: "Voucher's list is empty", vouchers: [] });
    }

    const formattedVouchers = vouchers.map((voucher: IVoucher) => ({
      ...voucher,
      createdBy: (voucher.createdBy as unknown as IUser).username,
    }));

    return res
      .status(200)
      .json({ vouchers: formattedVouchers, total: totalPages, page, limit });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const findVouchers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const voucher = await getVoucherById(id);

    if (!voucher) {
      return res.status(200).json({ message: "Voucher not found" });
    }

    const formattedVoucher = {
      ...voucher,
      createdBy: (voucher.createdBy as unknown as IUser).username,
    };

    return res.status(200).json({ voucher: formattedVoucher });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createdVoucher = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { code, discount, expirationDate, status } =
      req.body as RequestVoucher;
    const { id: userId } = req.user as any;

    if (!code || !discount || !expirationDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const voucherExists = await getVoucherByCode(code);
    if (voucherExists) {
      return res.status(400).json({ message: "Code's Voucher already exists" });
    }

    if (typeof code !== "string") {
      return res.status(400).json({ message: "Code must be a string" });
    }

    if (typeof discount !== "number") {
      return res.status(400).json({ message: "Discount must be a number" });
    }

    if (discount <= 0) {
      return res
        .status(400)
        .json({ message: "Discount must be greater than 0" });
    }

    if (expirationDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Expiration date must be greater than today" });
    }

    if (status !== "active" && status !== "inactive" && status !== "draft") {
      return res.status(400).json({ message: "Invalid status" });
    }

    const voucher = await createVoucher({
      code,
      discount,
      expirationDate,
      status,
      createdBy: userId,
    });

    return res.status(201).json({ message: "Voucher Created", voucher });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteVoucher = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const voucher = await getVoucherById(id);

    if (!voucher) {
      return res.status(200).json({ message: "Voucher not found" });
    }

    const users = await getUserByVoucherId(id);
    // Update voucher in the user's list
    if (users) {
      users.map(async (user) => {
        await updateVoucherFromUser(user._id, id, { status: "expired" });
      });
    }

    // Delete voucher in the database
    await deleteVoucherById(id);

    return res.status(200).json({ message: "Voucher deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateVoucher = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { code, discount, expirationDate, createdBy, status } =
      req.body as RequestVoucher;
    const { id: userId } = req.user as any;

    if (!code || !discount || !expirationDate || !createdBy || status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const voucher = await getVoucherById(id);

    if (!voucher) {
      return res.status(200).json({ message: "Voucher not found" });
    }

    if (typeof code !== "string") {
      return res.status(400).json({ message: "Code must be a string" });
    }

    if (typeof discount !== "number") {
      return res.status(400).json({ message: "Discount must be a number" });
    }

    if (discount <= 0) {
      return res
        .status(400)
        .json({ message: "Discount must be greater than 0" });
    }

    if (expirationDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Expiration date must be greater than today" });
    }

    let updatedBy = userId;
    if (createdBy !== userId) {
      updatedBy = createdBy;
    }

    const updatedData = {
      code,
      discount,
      expirationDate,
      createdBy,
      updatedBy,
      status,
    };

    const userUsingVoucher = await getUserByVoucherId(id);
    if (userUsingVoucher) {
      userUsingVoucher.map(async (user) => {
        await updateVoucherFromUser(user._id, id, updatedData);
      });
    }

    // Update voucher in the database
    const updateVoucher = await updateVoucherById(id, updatedData);

    return res
      .status(200)
      .json({ message: "Voucher updated", voucher: updateVoucher });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
