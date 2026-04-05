import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Database Connected Successfully");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}`);
};

export default connectDB;

// 2U4pV1SRbxv6sBe7