import {
  useState,
  useContext,
} from "react";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import { Link } from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

import { toast } from "react-toastify";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } =
    useContext(
      AuthContext
    );

  const handleSubmit =
    async (e) => {
      e.preventDefault();
      setIsLoggingIn(true);

      try {

        const res =
          await fetch(
            `${import.meta.env.VITE_API_URL}/login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
                password,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          toast.error(
            data.message
          );

          return;

        }

        login(

          data.token,

          data.role,

          data.userId

        );

        toast.success(
          "Logged In!"
        );

      } finally {

        setIsLoggingIn(false);
      }
    };
  return (
    <div className="login-page">

      <div className="login-layout">

        <div className="login-showcase">

          <div className="showcase-content">

            <span>

              🧶 Knot & Bloom

            </span>

            <h2>

              Handmade treasures,
              stitched with love.

            </h2>

            <p>

              Every crochet creation is handcrafted
              with care to make every gift memorable.

            </p>

          </div>

        </div>

        <div className="login-card">

          <div className="login-header">

            <h1>

              Welcome Back 👋

            </h1>

            <p>

              Sign in to continue shopping handcrafted creations.

            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <div className="password-field">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {

                  showPassword

                    ?

                    <EyeOff size={18} />

                    :

                    <Eye size={18} />

                }

              </button>

            </div>

            <div className="login-options">

              <label>

                <input type="checkbox" />

                Remember Me

              </label>

              <span
                className="forgot-password"
                onClick={() =>
                  toast.info(
                    "Coming soon 🚀"
                  )
                }
              >

                Forgot Password?

              </span>

            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
            >

              {

                isLoggingIn

                  ?

                  "Logging In..."

                  :

                  "Login"

              }

            </button>

          </form>

          <p className="register-link">

            Don't have an account?

            <a href="/register">

              Create One

            </a>

          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;