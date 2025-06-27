import mongoose from "mongoose"

export interface IStudent {
  _id?: string
  fullName: string
  spiritualName: string
  sex: string
  age: number
  class: string
  familyName: string
  phone: string
  address: string
  photo?: string
  group: string
  registrationDate: Date
}

const StudentSchema = new mongoose.Schema<IStudent>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    spiritualName: {
      type: String,
      required: true,
      trim: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["ወንድ", "ሴት"],
    },
    age: {
      type: Number,
      required: true,
      min: 4,
      max: 18,
    },
    class: {
      type: String,
      required: true,
      trim: true,
    },
    familyName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: "",
    },
    group: {
      type: String,
      required: true,
      enum: ["ቡድን ሀ", "ቡድን ለ", "ቡድን ሐ", "ቡድን መ", "ሌላ"],
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better performance
StudentSchema.index({ fullName: 1, spiritualName: 1, age: 1 })
StudentSchema.index({ phone: 1 }, { unique: true })
StudentSchema.index({ group: 1 })

export default mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema)
