import mongoose from "mongoose";

const homeVideoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const HomeVideo =
  mongoose.models.HomeVideo || mongoose.model("HomeVideo", homeVideoSchema);

export default HomeVideo;
