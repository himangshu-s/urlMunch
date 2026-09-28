import { createShortUrl } from "../services/url.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createUrl= asyncHandler(async(req,res)=>{
    const {originalUrl} = req.body;
    const url= await createShortUrl(originalUrl);

    return res
    .status(201)
    .json(new ApiResponse(201, url, "URl shortened successfully"));
});

export {createUrl};