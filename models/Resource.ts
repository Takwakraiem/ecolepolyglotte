import mongoose, { Schema, model, models } from "mongoose";

const resourceSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  type: { type: String, enum: ["pdf", "video", "image"], required: true },
  url: { type: String, required: true },
  filename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Resource = models.Resource || model("Resource", resourceSchema);

export default Resource;
