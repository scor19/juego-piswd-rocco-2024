import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validateEmail(email)) {
      setError("El correo electrónico no es válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/backend-piswd/register.php", {
        email,
        password,
      });

      if (response?.data?.success) {
        setIsRegistered(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(
          response?.data?.message || "No se pudo registrar. Inténtelo de nuevo."
        );
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form flex flex-col items-center justify-center h-screen bg-slate-800">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">Registro</h1>
      </header>
      <main className="register-container w-[300px] sm:w-[400px] bg-slate-700 rounded-xl p-8 shadow-2xl text-center space-y-4">
        {isRegistered ? (
          <div className="text-white">
            <h2 className="text-2xl font-bold">¡Registro exitoso!</h2>
            <p>Serás redirigido al inicio de sesión...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
            <form
              onSubmit={handleRegister}
              disabled={isLoading}
              className="register-form flex flex-col items-center justify-center"
            >
              <input
                type="text"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 mb-2"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 mb-2"
              />
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 mb-2"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="register-button w-[200px] p-3 rounded-xl focus:outline-none focus:border-blue-500 bg-blue-500 text-white transition duration-100 transform hover:scale-105 active:scale-95 active:bg-blue-400"
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </button>
            </form>
            {error && <p className="text-white">{error}</p>}
            <div className="mt-4">
              <p className="text-white">¿Ya tienes cuenta?</p>
              <Link
                to="/login"
                className="login-link text-blue-400 hover:text-blue-300 transition duration-150"
              >
                Inicia sesión aquí
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Register;
