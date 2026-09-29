import { createShortUrl } from "../services/url.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createUrl= asyncHandler(async(req,res)=>{
    const {originalUrl, expiresAt, customAlias} = req.body;
    const url= await createShortUrl(originalUrl, expiresAt, customAlias, req.user.userId,);

    return res
    .status(201)
    .json(new ApiResponse(201, url, "URl shortened successfully"));
});

export {createUrl};