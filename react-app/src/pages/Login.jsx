import { useState, useContext } from "react";

import {
  AuthContext,
} from "../context/AuthContext";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const { login } =
    useContext(
      AuthContext
    );

  const handleSubmit =
    async (e) => {

      e.preventDefault();

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

      login(data.token);

      alert(
        "Logged In!"
      );
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
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;