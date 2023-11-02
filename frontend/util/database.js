import mongoose from 'mongoose';

let isConnected = false;

export const connectToDb = async () => {
    mongoose.set("strictQuery", true);
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "speedburn",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}