import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import {generateAccessToken, generateRefreshToken , verifyRefreshToken} from "../utils/token.js";
import RefreshToken from "../models/refreshToken.model.js";
import hashToken from "../utils/hashToken.js";


const createAuthTokens = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const tokenHash = hashToken(refreshToken);

  const refreshTokenExpiry = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  );

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt: refreshTokenExpiry,
  });

  return {
    accessToken,
    refreshToken,
  };
};


const registerUser= async({username, email, password})=>{
    const normalizedEmail= email.toLowerCase();
    const existingUser= await User.findOne({
        $or:[
            {username},
            {email:normalizedEmail}
        ],
    });
    if(existingUser){
        throw new ApiError(409, "Username or email already exists")
    }
    // hash password before storing it
    const hashedPassword= await bcrypt.hash(password,12);
    
    const user= await User.create({
        username, 
        email:normalizedEmail,
        password: hashedPassword,
    });


    const userId = user._id.toString();

const { accessToken, refreshToken } =
  await createAuthTokens(userId);


    // never return the password hash
    return {
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
  },
  accessToken,
  refreshToken,
};
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

const userId = user._id.toString();

const { accessToken, refreshToken } =
  await createAuthTokens(userId);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};


const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const tokenHash = hashToken(refreshToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash,
    user: decoded.userId,
  });

  if (!storedToken) {
    throw new ApiError(401, "Refresh token has been revoked");
  }

  if (storedToken.expiresAt <= new Date()) {
    await RefreshToken.deleteOne({ _id: storedToken._id });

    throw new ApiError(401, "Refresh token has expired");
  }

  const newAccessToken = generateAccessToken(decoded.userId);

  const newRefreshToken = generateRefreshToken(decoded.userId);
  const newTokenHash = hashToken(newRefreshToken);

  const newExpiry = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  );

  await RefreshToken.findByIdAndUpdate(storedToken._id, {
    tokenHash: newTokenHash,
    expiresAt: newExpiry,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);

  await RefreshToken.deleteOne({
    tokenHash,
  });
};

const logoutAllUsers = async (userId) => {
  await RefreshToken.deleteMany({
    user: userId,
  });
};

export {registerUser,loginUser, refreshAccessToken,logoutUser,logoutAllUsers};

/*Why .toString() on _id?

MongoDB's _id is an ObjectId:

user._id

JWT payloads are normally easier to work with when we explicitly put the ID in as a string:

user._id.toString()

So our token payload becomes conceptually:

{
  "userId": "68abc123..."
}

rather than relying on MongoDB's ObjectId object. */