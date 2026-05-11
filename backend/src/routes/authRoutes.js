const express = require("express");

const {
  registrarUsuario,
  loginUsuario,
} = require("../controllers/authController");

const { protegerRuta } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

router.get("/perfil", protegerRuta, (req, res) => {
  res.json({
    mensaje: "Ruta protegida",
    usuario: req.usuario,
  });
});

module.exports = router;