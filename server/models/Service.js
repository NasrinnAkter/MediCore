import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true }, // store icon name as string e.g. "Brain", "Heart"
    description: { type: String, required: true },
    details: [{ type: String }], // array of bullet points
    order: { type: Number, default: 0 }, // for controlling display order
  },
  { timestamps: true },
);

export default mongoose.model("Service", serviceSchema);
