import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    degree: { type: String, default: "" },
    role: { type: String, default: "" },
    specialty: { type: String, default: "" },
    department: { type: String, required: true },
    photo: { type: String, default: "" },
    bio: { type: String, default: "" },
    email: { type: String },
    phone: { type: String },
    available: { type: Boolean, default: true },
    schedule: [
      {
        day: { type: String },
        hours: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
