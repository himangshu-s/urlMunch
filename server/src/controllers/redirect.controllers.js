import { getUrlByShortCode } from "../services/url.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const redirectToOriginalUrl= asyncHandler(async(req,res)=>{
    const {shortCode}= req.params;
    const url= await getUrlByShortCode(shortCode);
    if(!url){
        throw new ApiError(404, "short url not found");
    }
    if(url.expiresAt && url.expiresAt <=new Date()){ // current time or current date
         throw new ApiError(410, "Short URL has expired");
    }
    url.clicks +=1;
    await url.save();
    return res.redirect(url.originalUrl);
})

export {redirectToOriginalUrl};