import mongoose from "mongoose";
const connectDatabase= async() =>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongodb connected : ${connectionInstance.connection.host}`);

    }
    catch(error){
        console.error("Mongodb connection failed:", error.message);
        process.exit(1);

    }
};
export default connectDatabase;