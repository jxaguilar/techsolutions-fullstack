import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Proyectos from "./pages/Proyectos";
import ProtectedRoute from "./routes/ProtectedRoute";
import Tareas from "./pages/Tareas";
import Usuarios from "./pages/Usuarios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proyectos"
          element={
            <ProtectedRoute>
              <Proyectos />
            </ProtectedRoute>
          }
        />

<Route
  path="/tareas"
  element={
    <ProtectedRoute>
      <Tareas />
    </ProtectedRoute>
  }
/>

<Route
  path="/usuarios"
  element={
    <ProtectedRoute>
      <Usuarios />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;