import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [usuariosCliente, setUsuariosCliente] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [form, setForm] = useState({
  nombre: "",
  correo: "",
  telefono: "",
  empresa: "",
  estado: "activo",
  usuario: "",
  });
  const usuario = JSON.parse(localStorage.getItem("usuario"));
const esAdmin = usuario?.role === "admin";


  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

const obtenerClientes = async () => {
  const token = localStorage.getItem("token");

  const respuesta = await api.get("/clientes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setClientes(respuesta.data);

  if (esAdmin) {
    const usuarios = await api.get("/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsuariosCliente(
      usuarios.data.filter(
        (u) => u.role === "cliente"
      )
    );
  }
};

  const limpiarFormulario = () => {
    setForm({
  nombre: "",
  correo: "",
  telefono: "",
  empresa: "",
  estado: "activo",
  usuario: "",
  });

    setEditandoId(null);
  };

const crearCliente = async (e) => {
  e.preventDefault();

  if (
  !form.nombre.trim() ||
  !form.correo.trim() ||
  !form.telefono.trim() ||
  !form.empresa.trim() ||
  !form.usuario
) {
  alert("Debes completar todos los campos");
  return;
}

  try {
    const token = localStorage.getItem("token");

    await api.post("/clientes", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Cliente creado correctamente");

    limpiarFormulario();
    obtenerClientes();
  } catch (error) {
    alert(
      error.response?.data?.mensaje ||
        "Error al crear cliente"
    );
  }
};

  const editarCliente = (cliente) => {
    setEditandoId(cliente._id);

    setForm({
  nombre: cliente.nombre,
  correo: cliente.correo,
  telefono: cliente.telefono,
  empresa: cliente.empresa,
  estado: cliente.estado,
  usuario: cliente.usuario?._id || "",
});
  };

const actualizarCliente = async (e) => {
  e.preventDefault();

if (
  !form.nombre.trim() ||
  !form.correo.trim() ||
  !form.telefono.trim() ||
  !form.empresa.trim() ||
  !form.usuario
) {
  alert("Debes completar todos los campos");
  return;
}

  try {
    const token = localStorage.getItem("token");

    await api.put(`/clientes/${editandoId}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Cliente actualizado correctamente");

    limpiarFormulario();
    obtenerClientes();
  } catch (error) {
    alert(
      error.response?.data?.mensaje ||
        "Error al actualizar cliente"
    );
  }
};

  const eliminarCliente = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este cliente?"
    );

    if (!confirmar) return;

    const token = localStorage.getItem("token");

    await api.delete(`/clientes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    obtenerClientes();
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h1>Gestión de Clientes</h1>

        {esAdmin && (

        <form
          className="form-card"
          onSubmit={editandoId ? actualizarCliente : crearCliente}
        >
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            placeholder="Correo"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
          />

          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />

          <input
            placeholder="Empresa"
            value={form.empresa}
            onChange={(e) => setForm({ ...form, empresa: e.target.value })}
          />

          <select
  value={form.usuario}
  onChange={(e) =>
    setForm({ ...form, usuario: e.target.value })
  }
>
  <option value="">Asignar cliente</option>

  {usuariosCliente.map((usuario) => (
    <option key={usuario._id} value={usuario._id}>
      {usuario.name}
    </option>
  ))}
</select>




          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <button type="submit">
            {editandoId ? "Actualizar Cliente" : "Guardar Cliente"}
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
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Usuario Cliente</th>
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.empresa}</td>
                <td>{cliente.estado}</td>
                <td>{cliente.usuario?.name || "Sin asignar"}</td>

    {esAdmin&& (           
                <td>
    <button
      className="btn-edit"
      onClick={() => editarCliente(cliente)}
    >
      Editar
    </button>

    <button
      className="btn-delete"
      onClick={() => eliminarCliente(cliente._id)}
    >
      Eliminar
    </button>
  </td>
    )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Clientes;