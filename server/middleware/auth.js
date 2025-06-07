import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const { username, user_id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, user_id };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
}

export default authMiddleware;