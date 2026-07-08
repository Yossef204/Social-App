import mongoose from "mongoose";
import { DB_URL } from "../config";

export const connectDB = () => {
    mongoose.connect(DB_URL)
        .then(() => {
            console.log("Connected to DB successfully");
        })
        .catch((err) => {
            console.log(DB_URL);
            console.log("Error connecting to DB: ", err);
        });
}