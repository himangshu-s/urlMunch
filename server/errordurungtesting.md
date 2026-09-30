why not from import dotenv from "dotenv" ?
ans=        The error happened because JWT was trying to sign your access token without receiving a secret key.

The exact error was:

secretOrPrivateKey must have a value

Your code eventually does:

jwt.sign(
  { userId },
  process.env.ACCESS_TOKEN_SECRET,
  ...
);

For that request, this was effectively:

jwt.sign(
  { userId },
  undefined,
  ...
);

And jsonwebtoken refuses to create a JWT without a signing secret.

Why was ACCESS_TOKEN_SECRET undefined?

The issue was when .env was loaded.

You had:

import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";

dotenv.config();

With ES modules, the imported modules are evaluated as part of module loading before the body of server.js runs. So relying on:

dotenv.config();

at that point can cause imported modules to see environment variables before they're loaded, especially if something accesses process.env during module initialization.

Using:

import "dotenv/config";

loads dotenv as part of the module initialization itself.

So the flow becomes:

Start Node
   ↓
Load .env
   ↓
process.env.ACCESS_TOKEN_SECRET exists
   ↓
Load application modules
   ↓
JWT functions can access the secret
   ↓
Registration works
One important clarification

Your JWT utility wasn't actually wrong:

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
  );
};

The problem was that:

process.env.ACCESS_TOKEN_SECRET

didn't contain a value at the time it was being used.

That's why MongoDB and Redis could both be working perfectly while registration still failed:

MongoDB ✅
Redis    ✅
Express  ✅
JWT      ❌ ACCESS_TOKEN_SECRET missing

So this was a configuration initialization problem, not an authentication-logic problem.