import mongoose from "mongoose"

export interface IAttendance {
  _id?: string
  studentId: string
  date: Date
  sessions: {
    monday: boolean
    wednesday: boolean
    friday: boolean
  }
}

const AttendanceSchema = new mongoose.Schema<IAttendance>(
  {
    studentId: {
      type: String,
      required: true,
      ref: "Student",
    },
    date: {
      type: Date,
      required: true,
    },
    sessions: {
      monday: {
        type: Boolean,
        default: false,
      },
      wednesday: {
        type: Boolean,
        default: false,
      },
      friday: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Create compound index for unique student-date combination
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true })

export default mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema)
