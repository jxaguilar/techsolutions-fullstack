const jwt = require("jsonwebtoken");

const protegerRuta = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.usuario = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        mensaje: "Token no válido",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      mensaje: "No autorizado",
    });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      mensaje: "Acceso denegado. Solo administradores.",
    });
  }
};

const adminOTrabajador = (req, res, next) => {
  if (
    req.usuario &&
    (req.usuario.role === "admin" || req.usuario.role === "trabajador")
  ) {
    next();
  } else {
    return res.status(403).json({
      mensaje: "Acceso denegado. Solo admin o trabajador.",
    });
  }
};

module.exports = {
  protegerRuta,
  soloAdmin,
  adminOTrabajador,
};