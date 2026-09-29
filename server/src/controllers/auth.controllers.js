import { registerUser } from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const register= asyncHandler(async(req,res)=>{
    const {username, email, password}=req.body;

    const user= await registerUser({
        username,
        email,
        password,
    });

     return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export { register };
