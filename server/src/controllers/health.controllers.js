import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (requestAnimationFrame,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,null,"urlMunch API is heathy"));
});

export {healthCheck};