const express = require("express");

const {
  crearProyecto,
  obtenerProyectos,
  actualizarProyecto,
  eliminarProyecto,
} = require("../controllers/projectController");

const {
  protegerRuta,
  soloAdmin,
  adminOTrabajador,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protegerRuta, obtenerProyectos);

router.post("/", protegerRuta, adminOTrabajador, crearProyecto);

router.put("/:id", protegerRuta, adminOTrabajador, actualizarProyecto);

router.delete("/:id", protegerRuta, soloAdmin, eliminarProyecto);

module.exports = router;