const express = require("express");

const {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea,
} = require("../controllers/taskController");

const {
  protegerRuta,
  soloAdmin,
  adminOTrabajador,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protegerRuta, obtenerTareas);

router.post("/", protegerRuta, adminOTrabajador, crearTarea);

router.put("/:id", protegerRuta, adminOTrabajador, actualizarTarea);

router.delete("/:id", protegerRuta, soloAdmin, eliminarTarea);

module.exports = router;