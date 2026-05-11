const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },

    correo: {
      type: String,
      required: true,
    },

    telefono: {
      type: String,
      required: true,
    },

    empresa: {
      type: String,
      required: true,
    },

    estado: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    },

    usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);