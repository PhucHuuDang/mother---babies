import crypto from "crypto";

const SERCET = "SERCET";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha512", [salt, password].join("/"))
    .update(SERCET)
    .digest("hex");
};
