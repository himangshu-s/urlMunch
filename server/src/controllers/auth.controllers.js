import { registerUser,loginUser , refreshAccessToken, logoutUser,logoutAllUsers} from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const { user, accessToken, refreshToken } = await registerUser({
    username,
    email,
    password,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {
          user,
          accessToken,
        },
        "User registered successfully",
      ),
    );
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser({
    email,
    password,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
        },
        "Login successful",
      ),
    );
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = await refreshAccessToken(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken },
        "Access token refreshed successfully",
      ),
    );
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await logoutUser(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Logged out successfully"),
    );
});

const logoutAll = asyncHandler(async (req, res) => {
  await logoutAllUsers(req.user.userId);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Logged out from all devices",
      ),
    );
});

export { register, login, refresh,logout,logoutAll };

/*. Now both registration and login have the same authentication behavior:

REGISTER
   ↓
Create user
   ↓
Create access token
Create refresh token
   ↓
Store refresh-token hash
   ↓
Refresh token → HttpOnly cookie
Access token → JSON

and:

LOGIN
   ↓
Verify credentials
   ↓
Create access token
Create refresh token
   ↓
Store refresh-token hash
   ↓
Refresh token → HttpOnly cookie
Access token → JSON */