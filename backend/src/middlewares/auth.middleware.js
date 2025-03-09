import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { generateAccessAndRefereshTokens } from '../controllers/user.controller.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        try {
          const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
          const refreshedUser = await User.findById(decodedToken?._id);

          if (!refreshedUser) {
            throw new ApiError(401, "Invalid refresh token");
          }

          if (refreshToken !== refreshedUser?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
          }

          const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(refreshedUser._id);
          refreshedUser.accessToken = accessToken;
          refreshedUser.refreshToken = newRefreshToken;
          await refreshedUser.save();

          req.cookies.accessToken = accessToken;
          req.cookies.refreshToken = newRefreshToken;
          req.user = refreshedUser;
          return verifyJWT(req, res, next);
        } catch (error) {
          if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token is expired or used' });
          }
          throw new ApiError(401, error?.message || "Invalid refresh token");
        }
      }
    }
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});