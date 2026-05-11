const express = require("express");

const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerTrabajadores,
} = require("../controllers/userController");

const { protegerRuta, soloAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protegerRuta, soloAdmin, obtenerUsuarios);
router.post("/", protegerRuta, soloAdmin, crearUsuario);
router.get("/trabajadores", protegerRuta, obtenerTrabajadores);
router.put("/:id", protegerRuta, soloAdmin, actualizarUsuario);
router.delete("/:id", protegerRuta, soloAdmin, eliminarUsuario);

module.exports = router;