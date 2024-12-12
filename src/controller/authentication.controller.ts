import express from "express";
import { createUser, getUserByEmail, updatePassword } from "../services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../schema";

// Regex for email and password validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" }).end();
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Email or password is not match" })
        .end();
    }

    // Check if the user exists
    const user: IUser = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" }).end();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" }).end();
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    const token = jwt.sign(payload, "jwt-secret", {
      expiresIn: "3h",
    });

    (req.session as any).user = payload;

    return res.status(200).json({ user: payload, token }).end();
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

const getPasswordErrorMessage = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit.";
  }
  return null;
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, password, role } = req.body;

    // Check if the email, username, and password are provided
    if (!email || !username || !password) {
      console.log("Missing fields");
      return res.status(400).json({ message: "Missing fields" }).end();
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" }).end();
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email is not valid" }).end();
    }

    const passwordError = getPasswordErrorMessage(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError }).end();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      email,
      username,
      password: hashedPassword,
      role,
    });

    await createUser(newUser);

    return res.status(201).json({ message: "User created" }).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" }).end();
  }
};

export const changePassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const { id: userId } = req.user as any;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" }).end();
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" }).end();
    }

    if (userId !== id) {
      return res.status(403).json({ message: "Forbidden" }).end();
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" }).end();
    }

    await updatePassword(id, await bcrypt.hash(newPassword, 10));

    return res.status(200).json({ message: "Password updated" }).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" }).end();
  }
};
