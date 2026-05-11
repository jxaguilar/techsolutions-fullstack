import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cliente",
  });

  const token = localStorage.getItem("token");

  const obtenerUsuarios = async () => {
    const respuesta = await api.get("/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsuarios(respuesta.data);
  };

  const limpiarFormulario = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "cliente",
    });

    setEditandoId(null);
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Completa todos los campos");
      return;
    }

    await api.post("/usuarios", form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    limpiarFormulario();
    obtenerUsuarios();
  };

  const editarUsuario = (usuario) => {
    setEditandoId(usuario._id);

    setForm({
      name: usuario.name,
      email: usuario.email,
      password: "",
      role: usuario.role,
    });
  };

  const actualizarUsuario = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.role) {
      alert("Completa nombre, correo y rol");
      return;
    }

    await api.put(`/usuarios/${editandoId}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    limpiarFormulario();
    obtenerUsuarios();
  };

  const eliminarUsuario = async (id) => {
    const confirmar = window.confirm("¿Eliminar este usuario?");
    if (!confirmar) return;

    await api.delete(`/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    obtenerUsuarios();
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h1>Gestión de Usuarios</h1>

        <form
          className="form-card"
          onSubmit={editandoId ? actualizarUsuario : crearUsuario}
        >
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder={
              editandoId
                ? "Nueva contraseña opcional"
                : "Contraseña"
            }
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
  value={form.role}
  onChange={(e) => setForm({ ...form, role: e.target.value })}
>
  <option value="cliente">Cliente</option>
  <option value="trabajador">Trabajador</option>
  <option value="admin">Administrador</option>
</select>

          <button type="submit">
            {editandoId ? "Actualizar Usuario" : "Crear Usuario"}
          </button>

          {editandoId && (
            <button type="button" onClick={limpiarFormulario}>
              Cancelar
            </button>
          )}
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.role}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => editarUsuario(usuario)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => eliminarUsuario(usuario._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Usuarios;