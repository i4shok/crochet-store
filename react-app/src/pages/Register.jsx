import { useState } from "react";
import { toast } from "react-toastify";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [isRegistering,
    setIsRegistering] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setIsRegistering(true);

      try {

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

        if (!res.ok) {

          toast.error(
            data.message
          );

          return;

        }

        toast.success(
          data.message
        );

        setName("");
        setEmail("");
        setPassword("");

      } finally {

        setIsRegistering(false);

      }

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
          disabled={isRegistering}
        >
          {
            isRegistering
              ? "Registering..."
              : "Register"
          }
        </button>

      </form>

    </div>

  );

}

export default Register;