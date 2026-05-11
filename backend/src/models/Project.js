const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en_proceso", "finalizado"],
      default: "pendiente",
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);