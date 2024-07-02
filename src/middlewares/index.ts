import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel, IUser } from "../schema";

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, "jwt-secret") as JwtPayload;
    req.user = await UserModel.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Not authorized as an admin" });
  }
};

export const user = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Not authorized as a user" });
  }
};

export const staff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "staff") {
    next();
  } else {
    res
      .status(403)
      .json({ success: false, message: "Not authorized as a staff" });
  }
};
