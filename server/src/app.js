import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";
const app= express();

app.use(helmet()); // Adds various HTTP security headers.
app.use(cors()); // Allows our frontend to communicate with the backend from another origin.
app.use(express.json()); // can parse json data
app.use(express.urlencoded({extended:true})); //Allows Express to parse URL-encoded request bodies. 
app.use(morgan("dev")); // Logs incoming HTTP requests
app.use(errorHandler);
app.use("/api",healthRoutes);

export default app;