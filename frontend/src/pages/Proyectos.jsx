import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Proyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const esCliente = usuario?.role === "cliente";
  const esAdmin = usuario?.role === "admin";
  const puedeGestionar = usuario?.role === "admin" || usuario?.role === "trabajador";


  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "pendiente",
    cliente: "",
  });

  const proyectosFiltrados = proyectos.filter((proyecto) =>
  proyecto.nombre.toLowerCase().includes(busqueda.toLowerCase())
);

  const token = localStorage.getItem("token");

  const obtenerDatos = async () => {
    const resProyectos = await api.get("/proyectos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resClientes = await api.get("/clientes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProyectos(resProyectos.data);
    setClientes(resClientes.data);
  };

const calcularAvance = (estado) => {
  if (estado === "pendiente") return 25;
  if (estado === "en_proceso") return 60;
  if (estado === "finalizado") return 100;
  return 0;
};

const formatearEstado = (estado) => {
  switch (estado) {
    case "pendiente":
      return "Pendiente";

    case "en_proceso":
      return "En proceso";

    case "finalizado":
      return "Finalizado";

    default:
      return estado;
  }
};

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
      estado: "pendiente",
      cliente: "",
    });
    setEditandoId(null);
  };

  const crearProyecto = async (e) => {
    e.preventDefault();

    if (
  !form.nombre ||
  !form.descripcion ||
  !form.fechaInicio ||
  !form.fechaFin ||
  !form.cliente
) {
  alert("Completa todos los campos");
  return;
}

    await api.post("/proyectos", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    limpiarFormulario();
    obtenerDatos();
  };

  const editarProyecto = (proyecto) => {
    setEditandoId(proyecto._id);

    setForm({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      fechaInicio: proyecto.fechaInicio?.slice(0, 10),
      fechaFin: proyecto.fechaFin?.slice(0, 10),
      estado: proyecto.estado,
      cliente: proyecto.cliente?._id,
    });
  };

  const actualizarProyecto = async (e) => {
    e.preventDefault();

    await api.put(`/proyectos/${editandoId}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    limpiarFormulario();
    obtenerDatos();
  };

  const eliminarProyecto = async (id) => {
    const confirmar = window.confirm("¿Eliminar este proyecto?");
    if (!confirmar) return;

    await api.delete(`/proyectos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    obtenerDatos();
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h1>Gestión de Proyectos</h1>

        {puedeGestionar && (

        <form
          className="form-card"
          onSubmit={editandoId ? actualizarProyecto : crearProyecto}
        >
          <input
            placeholder="Nombre del proyecto"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <input
            type="date"
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
          />

          <input
            type="date"
            value={form.fechaFin}
            onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
          />

          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="finalizado">Finalizado</option>
          </select>

          <select
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          >
            <option value="">Seleccione cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre}
              </option>
            ))}
          </select>

          <button type="submit">
            {editandoId ? "Actualizar Proyecto" : "Guardar Proyecto"}
          </button>

          {editandoId && (
            <button type="button" onClick={limpiarFormulario}>
              Cancelar
            </button>
          )}
        </form>
        )}

        <input
  className="search-input"
  type="text"
  placeholder="Buscar proyecto..."
  value={busqueda}
  onChange={(e) => setBusqueda(e.target.value)}
/>

{esCliente && (
  <div className="project-report-grid">
    {proyectosFiltrados.map((proyecto) => (
      <div className="project-report-card" key={proyecto._id}>
        <h2>{proyecto.nombre}</h2>

        <p>{proyecto.descripcion}</p>

        <div className="report-row">
          <strong>Estado:</strong>
          <span>{formatearEstado(proyecto.estado)}</span>
        </div>

        <div className="report-row">
          <strong>Inicio:</strong>
          <span>{proyecto.fechaInicio?.slice(0, 10)}</span>
        </div>

        <div className="report-row">
          <strong>Fin:</strong>
          <span>{proyecto.fechaFin?.slice(0, 10)}</span>
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${calcularAvance(proyecto.estado)}%` }}
          >
            {calcularAvance(proyecto.estado)}%
          </div>
        </div>
      </div>
    ))}
  </div>
)}


        {!esCliente && (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
              <th>Cliente</th>
              {puedeGestionar && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {proyectosFiltrados.map((proyecto) => (
              <tr key={proyecto._id}>
                <td>{proyecto.nombre}</td>
                <td>{proyecto.descripcion}</td>
                <td>{proyecto.fechaInicio?.slice(0, 10)}</td>
                <td>{proyecto.fechaFin?.slice(0, 10)}</td>
                <td>{formatearEstado(proyecto.estado)}</td>
                <td>{proyecto.cliente?.nombre}</td>

    {puedeGestionar && (            
                <td>
    <button
      className="btn-edit"
      onClick={() => editarProyecto(proyecto)}
    >
      Editar
    </button>

    {esAdmin && (
      <button
        className="btn-delete"
        onClick={() => eliminarProyecto(proyecto._id)}
      >
        Eliminar
      </button>
    )}
  </td>
    )}
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </Layout>
  );
}

export default Proyectos;