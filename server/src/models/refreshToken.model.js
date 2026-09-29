
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const RefreshToken = mongoose.model(
  "RefreshToken",
  refreshTokenSchema,
);

export default RefreshToken;


/*We'll create a separate model rather than putting refresh tokens directly on the User document.

Why?

A user can eventually have multiple sessions:

User
 ├── Chrome session
 ├── Mac session
 └── Phone session

Each can have its own refresh token.

The architecture becomes:

User
  │
  ├── Session 1 → refresh token hash
  ├── Session 2 → refresh token hash
  └── Session 3 → refresh token hash

This also gives us a place to later implement:

logout from one device
logout from all devices
refresh-token rotation
token revocation
session expiration */