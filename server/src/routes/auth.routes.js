import express from "express";
import { register,login, refresh } from "../controllers/auth.controllers.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema,loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
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
    Return new access token */