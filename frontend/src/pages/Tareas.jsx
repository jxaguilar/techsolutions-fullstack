import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [trabajadores, setTrabajadores] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const esAdmin = usuario?.role === "admin";

const puedeGestionar = usuario?.role === "admin" || usuario?.role === "trabajador";


  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    responsable: "",
    prioridad: "media",
    estado: "pendiente",
    proyecto: "",
  });

  const tareasFiltradas = tareas.filter((tarea) =>
  tarea.titulo.toLowerCase().includes(busqueda.toLowerCase())
);

  const token = localStorage.getItem("token");

  const obtenerDatos = async () => {
    const resTareas = await api.get("/tareas", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resProyectos = await api.get("/proyectos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const resTrabajadores = await api.get("/usuarios/trabajadores", {
  headers: { Authorization: `Bearer ${token}` },
});

    setTareas(resTareas.data);
    setProyectos(resProyectos.data);
    setTrabajadores(resTrabajadores.data);
  };

  const limpiarFormulario = () => {
    setForm({
      titulo: "",
      descripcion: "",
      responsable: "",
      prioridad: "media",
      estado: "pendiente",
      proyecto: "",
    });

    setEditandoId(null);
  };

  const crearTarea = async (e) => {
    e.preventDefault();

    if (
  !form.titulo ||
  !form.descripcion ||
  !form.responsable ||
  !form.proyecto
) {
  alert("Completa todos los campos");
  return;
}

    await api.post("/tareas", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    limpiarFormulario();
    obtenerDatos();
  };

  const editarTarea = (tarea) => {
    setEditandoId(tarea._id);

    setForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      responsable: tarea.responsable,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      proyecto: tarea.proyecto?._id,
    });
  };

  const actualizarTarea = async (e) => {
    e.preventDefault();

    await api.put(`/tareas/${editandoId}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    limpiarFormulario();
    obtenerDatos();
  };

  const eliminarTarea = async (id) => {
    const confirmar = window.confirm("¿Eliminar esta tarea?");
    if (!confirmar) return;

    await api.delete(`/tareas/${id}`, {
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
        <h1>Gestión de Tareas</h1>

        {puedeGestionar && (

        <form
          className="form-card"
          onSubmit={editandoId ? actualizarTarea : crearTarea}
        >
          <input
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />

          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) =>
              setForm({ ...form, descripcion: e.target.value })
            }
          />

          <select
  value={form.responsable}
  onChange={(e) =>
    setForm({ ...form, responsable: e.target.value })
  }
>
  <option value="">Seleccione trabajador</option>

  {trabajadores.map((trabajador) => (
    <option key={trabajador._id} value={trabajador._id}>
      {trabajador.name}
    </option>
  ))}
</select>

          <select
            value={form.prioridad}
            onChange={(e) =>
              setForm({ ...form, prioridad: e.target.value })
            }
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>

          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="finalizada">Finalizada</option>
          </select>

          <select
            value={form.proyecto}
            onChange={(e) => setForm({ ...form, proyecto: e.target.value })}
          >
            <option value="">Seleccione proyecto</option>

            {proyectos.map((proyecto) => (
              <option key={proyecto._id} value={proyecto._id}>
                {proyecto.nombre}
              </option>
            ))}
          </select>

          <button type="submit">
            {editandoId ? "Actualizar Tarea" : "Guardar Tarea"}
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
  placeholder="Buscar tarea..."
  value={busqueda}
  onChange={(e) => setBusqueda(e.target.value)}
/>

        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Responsable</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Proyecto</th>
              {puedeGestionar && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {tareasFiltradas.map((tarea) => {
  const puedeEditar =
    esAdmin || tarea.responsable?._id === usuario?.id;

  return (
    <tr key={tarea._id}>
                <td>{tarea.titulo}</td>
                <td>{tarea.responsable?.name}</td>
                <td>{tarea.prioridad}</td>
                <td>{tarea.estado}</td>
                <td>{tarea.proyecto?.nombre}</td>

{puedeGestionar && (
  <td>
    {puedeEditar && (
      <button
        className="btn-edit"
        onClick={() => editarTarea(tarea)}
      >
        Editar
      </button>
    )}

    {esAdmin && (
      <button
        className="btn-delete"
        onClick={() => eliminarTarea(tarea._id)}
      >
        Eliminar
      </button>
    )}
  </td>
)}
              </tr>
  );
})}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Tareas;  