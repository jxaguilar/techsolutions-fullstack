
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect, useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/dashboard");
  }
}, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

      navigate("/dashboard");
    } catch (error) {
      setMensaje("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        {mensaje && <p className="error">{mensaje}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;