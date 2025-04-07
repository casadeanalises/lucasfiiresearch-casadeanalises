import { Schema, model, models } from "mongoose";

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor, insira um título"],
    },
    description: {
      type: String,
      required: [true, "Por favor, insira uma descrição"],
    },
    videoId: {
      type: String,
      required: [true, "Por favor, insira o ID do vídeo"],
    },
    thumbnail: {
      type: String,
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

export default models.Video || model("Video", videoSchema);
