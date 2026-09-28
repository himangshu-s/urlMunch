import crypto from "crypto";
const generateShortCode= (length=6)=>{
    const characters= 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const randomBytes= crypto.randomBytes(length);
    let shortCode= "";
    for(let i=0;i<length;i++){
        shortCode+= characters[randomBytes[i] % characters.length];
    }
    return shortCode;
};

export default generateShortCode;