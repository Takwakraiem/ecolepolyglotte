import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "ADMIN" | "TEACHER" | "STUDENT"
  phone?: string
  avatar?: string
  bio?: string
  language?: string
  currentLevel?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "TEACHER", "STUDENT"], default: "STUDENT" },
    phone: String,
    avatar: String,
    bio: String,
    language: String,
    currentLevel: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
