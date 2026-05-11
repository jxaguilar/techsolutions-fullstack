const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generarToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const registrarUsuario = async (req, res) => {
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
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      },
      token: generarToken(usuario._id, usuario.role),
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar usuario",
      error: error.message,
    });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: "Credenciales incorrectas",
      });
    }

    res.json({
      mensaje: "Inicio de sesión correcto",
      usuario: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      },
      token: generarToken(usuario._id, usuario.role),
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};