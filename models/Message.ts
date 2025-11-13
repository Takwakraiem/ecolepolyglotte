import mongoose, { Schema, type Document } from "mongoose"

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId
  recipient: mongoose.Types.ObjectId
  content: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)
