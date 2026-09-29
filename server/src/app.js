import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import urlRoutes from "./routes/url.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app= express();

app.use(helmet()); // Adds various HTTP security headers.
app.use(cors()); // Allows our frontend to communicate with the backend from another origin.
app.use(express.json()); // can parse json data
app.use(cookieParser()); // cookie-parser gives us that convenient req.cookies object for verification of cookies for access toekn generation by refresh token cookie. the built in res.cookie of express can set only cookies , but cant provide req.cookies object
app.use(express.urlencoded({extended:true})); //Allows Express to parse URL-encoded request bodies. 
app.use(morgan("dev")); // Logs incoming HTTP requests
app.use(errorHandler);

app.use("/api",healthRoutes);
app.use("/api/urls", urlRoutes);
app.use("/", redirectRoutes);
app.use("/api/auth", authRoutes);


export default app;