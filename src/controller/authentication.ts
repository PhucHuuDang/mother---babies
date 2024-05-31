import express from "express";
import { authentication, random } from "../helpers";
import { createUser, getUserByEmail } from "../db/users";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.password +authentication.salt"
    );

    if (!user) {
      return res.status(400);
    }

    const { salt } = user.authentication;
    const hashedPassword = authentication(salt, password);

    if (hashedPassword !== user.authentication.password) {
      return res.status(403);
    }

    // Generate a session token
    const token = random();
    user.authentication.sessionToken = authentication(
      token,
      user._id.toString()
    );

    await user.save();

    res.cookie("sessionToken", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, password } = req.body;

    // Check if the email, username, and password are provided
    if (!email || !username || !password) {
      return res.status(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: { password: authentication(salt, password), salt },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};
