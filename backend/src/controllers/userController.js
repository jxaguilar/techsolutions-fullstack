const User = require("../models/User");
const bcrypt = require("bcryptjs");

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const usuarioExiste = await User.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const usuario = await User.create({
      name,
      email,
      password: passwordEncriptada,
      role,
    });

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear usuario",
      error: error.message,
    });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const datosActualizados = {
      name,
      email,
      role,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(password, salt);
    }

    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true }
    ).select("-password");

    res.json(usuario);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      mensaje: "Usuario eliminado",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar usuario",
      error: error.message,
    });
  }
};

const obtenerTrabajadores = async (req, res) => {
  try {
    const trabajadores = await User.find({ role: "trabajador" }).select(
      "-password"
    );

    res.json(trabajadores);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener trabajadores",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerTrabajadores,
};