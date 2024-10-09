import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Hook para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validaciones de entrada
    if (!email || !password) {
      setError("Debes proporcionar un correo electrónico y contraseña");
      return;
    }

    // Validación de formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Debes proporcionar un correo electrónico válido");
      return;
    }

    // Validación de longitud de la contraseña
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("/backend-piswd/login.php", {
        email,
        password,
      });

      if (response?.data?.success) {
        onLogin();
        navigate("/game"); // Redirigir al juego después del login exitoso
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.error("Error en la autenticación", error);
        setError("Error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form flex flex-col items-center justify-center h-screen bg-slate-800">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">PISWD</h1>
      </header>
      <main className="login-container w-[300px] sm:w-[400px] bg-slate-700 rounded-xl p-8 shadow-2xl text-center space-y-4">
        <h2 className="text-2xl font-bold text-whiterounded-xl p-2 text-white">
          Iniciar Sesión
        </h2>
        <form
          onSubmit={handleLogin}
          disabled={isLoading}
          className="login-form flex flex-col items-center justify-center"
        >
          <input
            type="text"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={
              "w-full p-2 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 mb-2"
            }
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={
              "w-full p-2 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 mb-2"
            }
          />
          <button
            type="submit"
            disabled={isLoading}
            className="login-button w-[200px] p-3 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-500 text-white transition duration-100 transform hover:scale-105 active:scale-95 active:bg-blue-400"
          >
            {isLoading ? "Cargando..." : "Entrar"}
          </button>
        </form>
        {error && <p className="text-white">{error}</p>}
        <div className="mt-4">
          <p className="text-white">¿No tienes cuenta?</p>
          <Link
            to="/register"
            className="register-link text-blue-400 hover:text-blue-300 transition duration-150"
          >
            Regístrate aquí
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Login;
