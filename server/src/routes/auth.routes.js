import express from "express";
import { register,login, refresh,logout,  logoutAll, } from "../controllers/auth.controllers.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema,loginSchema } from "../validators/auth.validator.js";
import authenticate from "../middleware/auth.middleware.js";
import rateLimit from "../middleware/rateLimit.middleware.js";
const router = express.Router();
const loginRateLimit = rateLimit({
  windowInSeconds: 60,
  maxRequests: 5,
  keyPrefix: "rate-limit:login",
});
const registerRateLimit = rateLimit({
  windowInSeconds: 60,
  maxRequests: 3,
  keyPrefix: "rate-limit:register",
});
const refreshRateLimit = rateLimit({
  windowInSeconds: 60,
  maxRequests: 20,
  keyPrefix: "rate-limit:refresh",
});

router.post("/register",registerRateLimit, validate(registerSchema), register);
router.post("/login", loginRateLimit,validate(loginSchema), login);
router.post("/refresh", refreshRateLimit, refresh);
router.post("/logout", logout);
router.post("/logout-all", authenticate, logoutAll);
export default router;

/*. Access token expires
        ↓
Client calls
POST /api/auth/refresh
        ↓
Browser automatically sends
HttpOnly refreshToken cookie
        ↓
req.cookies.refreshToken
        ↓
verify JWT
        ↓
hash token
        ↓
find hash in MongoDB
        ↓
valid?
   ├── No → 401
   │
   └── Yes
         ↓
    Generate new access token
    Generate new refresh token
         ↓
    Replace old hash
         ↓
    Set new cookie
         ↓
    Return new access token 
    
    
    // Why does normal logout not require authentication?

Because it uses the refresh-token cookie itself to identify the session being revoked:

refresh cookie
     ↓
hash
     ↓
delete matching session

Whereas logout-all needs to know which user owns all the sessions:

Access token
     ↓
req.user.userId
     ↓
delete all sessions for this user
    
    
    */