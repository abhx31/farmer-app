import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connect";
import cors from "cors"
import { authRoutes } from "./routes/authRoutes";
import { farmerRoutes } from "./routes/farmerRoutes";
import { interestRoutes } from "./routes/interestRoutes";
import { orderRoutes } from "./routes/orderRoutes";
import { userRoutes } from "./routes/userRoutes";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
dotenv.config();
connectDB();

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/farmer', farmerRoutes)
app.use('/api/v1/interest', interestRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/user', userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`)
})

