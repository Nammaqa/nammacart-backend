import mongoose from "mongoose";

export const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL);

        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("MongoDB Error:");
        console.log(error);
    }
};