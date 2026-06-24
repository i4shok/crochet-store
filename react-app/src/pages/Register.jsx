import { useState } from "react";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const res =
        await fetch(
          `${import.meta.env.VITE_API_URL}/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

      const data =
        await res.json();

      alert(
        data.message
      );
    };

  return (
    <div className="page">

      <h1>
        Register
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
      >

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

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
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;