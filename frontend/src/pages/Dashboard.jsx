import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [clientes, setClientes] = useState(0);
  const [proyectos, setProyectos] = useState(0);
  const [tareas, setTareas] = useState(0);
  const [usuarios, setUsuarios] = useState(0);

  const obtenerDatos = async () => {
    const token = localStorage.getItem("token");

    const resProyectos = await api.get("/proyectos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProyectos(resProyectos.data.length);

    if (usuario?.role !== "cliente") {
      const resClientes = await api.get("/clientes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resTareas = await api.get("/tareas", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClientes(resClientes.data.length);
      setTareas(resTareas.data.length);
    }

    if (usuario?.role === "admin") {
      const resUsuarios = await api.get("/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(resUsuarios.data.length);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return (
    <Layout>
      <h1>Dashboard</h1>

      <div className="cards">
        {usuario?.role === "admin" && (
          <>
            <div
              className="card clickable"
              onClick={() => navigate("/clientes")}
            >
              <h3>Clientes</h3>
              <h2>{clientes}</h2>
              <p>Clientes registrados</p>
            </div>

            <div
              className="card clickable"
              onClick={() => navigate("/proyectos")}
            >
              <h3>Proyectos</h3>
              <h2>{proyectos}</h2>
              <p>Proyectos activos</p>
            </div>

            <div
              className="card clickable"
              onClick={() => navigate("/tareas")}
            >
              <h3>Tareas</h3>
              <h2>{tareas}</h2>
              <p>Tareas registradas</p>
            </div>

            <div
              className="card clickable"
              onClick={() => navigate("/usuarios")}
            >
              <h3>Usuarios</h3>
              <h2>{usuarios}</h2>
              <p>Usuarios del sistema</p>
            </div>
          </>
        )}

        {usuario?.role === "trabajador" && (
          <>
            <div
              className="card clickable"
              onClick={() => navigate("/clientes")}
            >
              <h3>Clientes</h3>
              <h2>{clientes}</h2>
              <p>Consulta de clientes</p>
            </div>

            <div
              className="card clickable"
              onClick={() => navigate("/proyectos")}
            >
              <h3>Proyectos</h3>
              <h2>{proyectos}</h2>
              <p>Proyectos asignados</p>
            </div>

            <div
              className="card clickable"
              onClick={() => navigate("/tareas")}
            >
              <h3>Tareas</h3>
              <h2>{tareas}</h2>
              <p>Tareas registradas</p>
            </div>
          </>
        )}

        {usuario?.role === "cliente" && (
          <div
            className="card clickable"
            onClick={() => navigate("/proyectos")}
          >
            <h3>Mis Proyectos</h3>
            <h2>{proyectos}</h2>
            <p>Revisión de estado de tus proyectos</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;