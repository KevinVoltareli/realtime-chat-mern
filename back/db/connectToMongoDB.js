import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("success connection");
  } catch (e) {
    console.log("Error connecting", e.message);
  }
};

export default connectToMongoDB;
