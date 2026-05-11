const Task = require("../models/Task");
const Client = require("../models/Client");
const Project = require("../models/Project");

const crearTarea = async (req, res) => {
  try {
    const tarea = await Task.create(req.body);
    res.status(201).json(tarea);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear tarea",
      error: error.message,
    });
  }
};

const obtenerTareas = async (req, res) => {
  try {
    let tareas;

    if (req.usuario.role === "cliente") {
      return res.json([]);
    }

    tareas = await Task.find()
      .populate("proyecto")
      .populate("responsable", "name email role");

    res.json(tareas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener tareas",
      error: error.message,
    });
  }
};

const actualizarTarea = async (req, res) => {
  try {
    const tarea = await Task.findById(req.params.id);

    if (!tarea) {
      return res.status(404).json({
        mensaje: "Tarea no encontrada",
      });
    }

    if (
      req.usuario.role === "trabajador" &&
      tarea.responsable.toString() !== req.usuario.id
    ) {
      return res.status(403).json({
        mensaje: "Solo puedes editar tareas asignadas a ti",
      });
    }

    const tareaActualizada = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("proyecto")
      .populate("responsable", "name email role");

    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar tarea",
      error: error.message,
    });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Tarea eliminada",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar tarea",
      error: error.message,
    });
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea,
};