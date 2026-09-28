import express from "express";
import { createUrl } from "../controllers/url.controllers.js";

const router= express.Router();
router.post("/",createUrl);
export default router;

/* We're going to mount this router under:

/api/urls

So the final endpoint becomes:

POST /api/urls */