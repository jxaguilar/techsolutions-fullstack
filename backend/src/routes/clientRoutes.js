const express = require("express");

const {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente,
} = require("../controllers/clientController");

const { protegerRuta, soloAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protegerRuta, obtenerClientes);

router.post("/", protegerRuta, soloAdmin, crearCliente);

router.put("/:id", protegerRuta, soloAdmin, actualizarCliente);

router.delete("/:id", protegerRuta, soloAdmin, eliminarCliente);

module.exports = router;