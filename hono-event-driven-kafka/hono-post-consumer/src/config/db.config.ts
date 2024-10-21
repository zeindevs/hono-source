import mongoose from "mongoose";

export const connectDb = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/event-driven-kafka")
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.error("Error connecting to database:", error);
    });
};
