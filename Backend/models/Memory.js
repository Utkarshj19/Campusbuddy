import mongoose from "mongoose";

const memorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [
    {
      role: String,
      content: String,
    },
  ],
});

export default mongoose.model("Memory", memorySchema);
