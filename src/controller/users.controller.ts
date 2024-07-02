import express from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../services";
import { RequestUser } from "../schema";

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^(0|\+84)\d{9,10}$/;
  return regex.test(phoneNumber);
};

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const query = (req.query.query as string) || "";

    const { users, totalPages } = await getUsers(query, page, limit);

    if (users.length === 0 || !users) {
      return res.status(200).json({ message: "User's list is empty" });
    }

    return res.status(200).json({ users, total: totalPages, page, limit });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const findUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { role } = req.user as any;

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" }).end();
    }

    // Delete user from database
    await deleteUserById(id);

    return res.status(200).json({ message: "Deleted successful" }).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username, phone, avatar, points, voucher } =
      req.body as RequestUser;

    // Check if the user ID matches the token
    if ((req.user as any).id !== id) {
      return res.status(403).json({ message: "Forbidden" }).end();
    }

    // Check if the fields are provided
    if (!username || !phone || !avatar) {
      return res.status(400).json({ message: "Missing fields" }).end();
    }

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ message: "Invalid phone number" }).end();
    }

    // Update user in database
    await updateUserById(id, {
      username,
      phone,
      avatar,
      points,
      voucher,
    });

    return res
      .status(200)
      .json({ message: "Updated successful", userId: id })
      .end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
