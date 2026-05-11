import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo" onClick={() => navigate("/dashboard")}>
          TechSolutions
        </h2>

        <ul>
  {usuario?.role !== "cliente" && (
    <li onClick={() => navigate("/clientes")}>
      Clientes
    </li>
  )}

  <li onClick={() => navigate("/proyectos")}>
    {usuario?.role === "cliente"
      ? "Mis Proyectos"
      : "Proyectos"}
  </li>

  {usuario?.role !== "cliente" && (
    <li onClick={() => navigate("/tareas")}>
      Tareas
    </li>
  )}

  {usuario?.role === "admin" && (
    <li onClick={() => navigate("/usuarios")}>
      Usuarios
    </li>
  )}
</ul>

        <p>Usuario: {usuario?.name}</p>
        <p>Rol: {usuario?.role}</p>

        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </aside>

      <main className="dashboard-content">{children}</main>
    </div>
  );
}

export default Layout;