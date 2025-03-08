import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the app if there's an error with DB connection
  }
};

export default connectDB;
//I9AbkRtCi9F40tgE
//15jygHGIlH6ZaHqp
