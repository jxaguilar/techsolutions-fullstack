const Project = require("../models/Project");
const Client = require("../models/Client");

const crearProyecto = async (req, res) => {
  try {
    const proyecto = await Project.create(req.body);
    res.status(201).json(proyecto);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear proyecto",
      error: error.message,
    });
  }
};

const obtenerProyectos = async (req, res) => {
  try {
    let proyectos;

    if (req.usuario.role === "cliente") {
      const cliente = await Client.findOne({ usuario: req.usuario.id });

      if (!cliente) {
        return res.json([]);
      }

      proyectos = await Project.find({ cliente: cliente._id }).populate("cliente");
    } else {
      proyectos = await Project.find().populate("cliente");
    }

    res.json(proyectos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener proyectos",
      error: error.message,
    });
  }
};

const actualizarProyecto = async (req, res) => {
  try {
    const proyecto = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(proyecto);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar proyecto",
      error: error.message,
    });
  }
};

const eliminarProyecto = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Proyecto eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar proyecto",
      error: error.message,
    });
  }
};

module.exports = {
  crearProyecto,
  obtenerProyectos,
  actualizarProyecto,
  eliminarProyecto,
};