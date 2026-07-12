import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    category: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    authorName: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("News", newsSchema);
