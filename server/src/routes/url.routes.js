import express from "express";
import { createUrl } from "../controllers/url.controllers.js";
import validate from "../middleware/validate.middleware.js";
import { createUrlSchema } from "../validators/url.validator.js";
import authenticate from "../middleware/auth.middleware.js";

const router= express.Router();
router.post("/",authenticate,validate(createUrlSchema),createUrl);
export default router;

/* We're going to mount this router under:

/api/urls

So the final endpoint becomes:

POST /api/urls */