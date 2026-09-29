import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const registerUser= async({username, email, password})=>{
    const normalizedEmail= email.toLowerCase();
    const existingUser= await User.findOne({
        $or:[
            {username},
            {email:normalizedEmail}
        ],
    });
    if(existingUser){
        throw new ApiError(409, "Username or email already exists")
    }
    // hash password before storing it
    const hashedPassword= await bcrypt.hash(password,12);
    
    const user= await User.create({
        username, 
        email:normalizedEmail,
        password: hashedPassword,
    });

    // never return the password hash
    return {
        id:user._id,
        username:user.username,
        email:user.email
    };
};

export {registerUser};