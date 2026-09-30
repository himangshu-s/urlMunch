import mongoose from "mongoose";
const urlSchema= new mongoose.Schema(
    {
        originalUrl:{
            type:String,
            required: true,
            trim:true
        },
    
    
        shortCode:{
            type:String,
            required:true,
            unique:true,
            index:true,
            trim:true
        },
        user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
        clicks:{
            type:Number,
            default:0
        },
        expiresAt:{
            type:Date,
            default:null,
        }
    },
    {
        timestamps:true,
    }
)
urlSchema.index({ user: 1, createdAt: -1 });

const Url= mongoose.model("Url", urlSchema);
export default Url;
/* We're doing:

unique: true,
index: true,

for shortCode.

This is important because our most common database operation will eventually be:

Url.findOne({ shortCode })

We want MongoDB to be able to find that record efficiently. */