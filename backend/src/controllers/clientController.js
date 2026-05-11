const Client = require("../models/Client");

const crearCliente = async (req, res) => {
  try {
    const { correo, telefono, usuario } = req.body;

    const condiciones = [
      { correo },
      { telefono },
    ];

    if (usuario) {
      condiciones.push({ usuario });
    }

    const clienteExiste = await Client.findOne({
      $or: condiciones,
    });

    if (clienteExiste) {
      return res.status(400).json({
        mensaje:
          "Ya existe un cliente con el mismo correo, teléfono o usuario asignado",
      });
    }

    const cliente = await Client.create(req.body);

    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear cliente",
      error: error.message,
    });
  }
};

const obtenerClientes = async (req, res) => {
  try {
    let clientes;

    if (req.usuario.role === "cliente") {
      clientes = await Client.find({ usuario: req.usuario.id }).populate(
        "usuario",
        "name email role"
      );
    } else {
      clientes = await Client.find().populate("usuario", "name email role");
    }

    res.json(clientes);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener clientes",
      error: error.message,
    });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { correo, telefono, usuario } = req.body;

    const condiciones = [
      { correo },
      { telefono },
    ];

    if (usuario) {
      condiciones.push({ usuario });
    }

    const clienteExiste = await Client.findOne({
      _id: { $ne: req.params.id },
      $or: condiciones,
    });

    if (clienteExiste) {
      return res.status(400).json({
        mensaje:
          "Ya existe otro cliente con el mismo correo, teléfono o usuario asignado",
      });
    }

    const cliente = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(cliente);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar cliente",
      error: error.message,
    });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Cliente eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar cliente",
      error: error.message,
    });
  }
};

module.exports = {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente,
};