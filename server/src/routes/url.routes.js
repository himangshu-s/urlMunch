import express from "express";
import { createUrl,getMyUrls,getMyUrlById, updateUrl,deleteUrl } from "../controllers/url.controllers.js";
import validate from "../middleware/validate.middleware.js";
import { createUrlSchema } from "../validators/url.validator.js";
import authenticate from "../middleware/auth.middleware.js";
import { updateUrlSchema } from "../validators/url-update.validator.js";
import rateLimit from "../middleware/rateLimit.middleware.js";
const router= express.Router();

const createUrlRateLimit = rateLimit({
  windowInSeconds: 60,
  maxRequests: 30,
  keyPrefix: "rate-limit:create-url",
});
router.post("/",authenticate,createUrlRateLimit,validate(createUrlSchema),createUrl);
router.get("/",authenticate,getMyUrls,);
router.get( "/:id",authenticate,getMyUrlById,);
router.patch("/:id", authenticate,validate(updateUrlSchema),updateUrl);
router.delete("/:id",authenticate,deleteUrl,);
export default router;

/* We're going to mount this router under:

/api/urls

So the final endpoint becomes:

POST /api/urls */