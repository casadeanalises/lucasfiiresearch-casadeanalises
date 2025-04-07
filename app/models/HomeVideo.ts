import { Schema, model, models } from "mongoose";

const homeVideoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Por favor, insira um título"],
    },
    description: {
      type: String,
      required: [true, "Por favor, insira uma descrição"],
    },
    url: {
      type: String,
      required: [true, "Por favor, insira a URL do vídeo"],
    },
    videoId: {
      type: String,
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

// Middleware para extrair o ID do vídeo da URL do YouTube
homeVideoSchema.pre("save", function (next) {
  console.log("Executando middleware pre-save...");
  console.log("URL do vídeo:", this.url);

  if (this.url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = this.url.match(regExp);
    console.log("Match do regex:", match);

    if (match && match[2].length === 11) {
      this.videoId = match[2];
      this.thumbnail = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
      console.log("ID do vídeo extraído:", this.videoId);
      console.log("Thumbnail gerada:", this.thumbnail);
    } else {
      console.log("URL do YouTube inválida");
    }
  }
  next();
});

// Também executar o middleware no update
homeVideoSchema.pre("findOneAndUpdate", function (next) {
  console.log("Executando middleware pre-update...");
  const update = this.getUpdate() as any;

  if (update?.url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = update.url.match(regExp);
    console.log("Match do regex (update):", match);

    if (match && match[2].length === 11) {
      update.videoId = match[2];
      update.thumbnail = `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
      console.log("ID do vídeo extraído (update):", update.videoId);
      console.log("Thumbnail gerada (update):", update.thumbnail);
    } else {
      console.log("URL do YouTube inválida (update)");
    }
  }
  next();
});

export default models.homevideos || model("homevideos", homeVideoSchema);
