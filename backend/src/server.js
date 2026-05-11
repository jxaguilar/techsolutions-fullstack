const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clientes", clientRoutes);
app.use("/api/proyectos", projectRoutes);
app.use("/api/tareas", taskRoutes);
app.use("/api/usuarios", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});