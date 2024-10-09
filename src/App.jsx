import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Game from "./components/Game";
import Register from "./components/Register"; // Importa el componente Register

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true); // Cambia el estado de autenticación
  };

  const handleRegister = () => {
    setIsAuthenticated(true); // Cambia el estado de autenticación después de registrarse
  };

  return (
    <Router>
      <Routes>
        {/* Ruta para el login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/game" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Ruta para el registro */}
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/game" />
            ) : (
              <Register onRegister={handleRegister} />
            )
          }
        />

        {/* Ruta para el juego, solo accesible si está autenticado */}
        <Route
          path="/game"
          element={isAuthenticated ? <Game /> : <Navigate to="/login" />}
        />

        {/* Ruta por defecto: redirige al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
