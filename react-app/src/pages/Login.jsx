import { useState, useContext } from "react";

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
          data.role
        );

        toast.success(
          "Logged In!"
        );

      } finally {

        setIsLoggingIn(false);
      }
    };
  return (
    <div className="page">

      <h1>
        Login
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
      >

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "Logging In..." : "Login"}
        </button>

      </form>

    </div>
  );
}

export default Login;