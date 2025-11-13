import mongoose, { Schema, model, models } from "mongoose"

interface ILangue {
  name: string
  description?: string
  flag?: string
  discount?: number
  createdAt?: Date
  updatedAt?: Date
}

const LangueSchema = new Schema<ILangue>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    flag: { type: String },
    discount: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
)

const Langue = models.Langue || model<ILangue>("Langue", LangueSchema)
export default Langue
