const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    responsable: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    prioridad: {
      type: String,
      enum: ["baja", "media", "alta"],
      default: "media",
    },
    estado: {
      type: String,
      enum: ["pendiente", "en_proceso", "finalizada"],
      default: "pendiente",
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);