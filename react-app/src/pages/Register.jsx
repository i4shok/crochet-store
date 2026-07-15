import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import "../styles/Login.css";
import { toast } from "react-toastify";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isRegistering,
    setIsRegistering] =
    useState(false);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setIsRegistering(true);

      if (password !== confirmPassword) {

        toast.error(
          "Passwords do not match."
        );

        setIsRegistering(false);

        return;

      }

      if (!passwordValid) {

        toast.error(
          "Please create a stronger password."
        );

        setIsRegistering(false);

        return;

      }

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

  const getPasswordStrength = () => {

    if (password.length < 6)
      return {
        text: "Weak",
        className: "weak",
      };

    if (
      password.length >= 6 &&
      password.length < 10
    )
      return {
        text: "Medium",
        className: "medium",
      };

    return {
      text: "Strong",
      className: "strong",
    };

  };

  const passwordStrength =
    getPasswordStrength();

  const passwordChecks = {

    length:
      password.length >= 8,

    uppercase:
      /[A-Z]/.test(password),

    lowercase:
      /[a-z]/.test(password),

    number:
      /\d/.test(password),

    special:
      /[^A-Za-z0-9]/.test(password),

  };

  const passwordValid =

    Object.values(
      passwordChecks
    ).every(Boolean);

    console.log(passwordChecks);
console.log(passwordValid);

  return (

    <div className="login-page">

      <div className="login-layout">

        <div className="login-showcase">

          <div className="showcase-content">

            <span>

              🧶 Knot & Bloom

            </span>

            <h2>

              Join our handmade community.

            </h2>

            <p>

              Create your account and discover handcrafted crochet creations made with love.

            </p>

          </div>

        </div>

        <div className="login-card">

          <div className="login-header">

            <h1>

              Create Account ✨

            </h1>

            <p>

              Start your Knot & Bloom journey.

            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />

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
                  setPassword(e.target.value)
                }
                required
              />

              {

                password.length > 0 && (

                  <div
                    className={`password-strength ${passwordStrength.className}`}
                  >

                    Password Strength:

                    <strong>

                      {" "}
                      {passwordStrength.text}

                    </strong>

                  </div>

                )

              }
              {

                password.length > 0 && (

                  <div className="password-checklist">

                    <p
                      className={
                        passwordChecks.length
                          ? "valid"
                          : "invalid"
                      }
                    >

                      ✓ At least 8 characters

                    </p>

                    <p
                      className={
                        passwordChecks.uppercase
                          ? "valid"
                          : "invalid"
                      }
                    >

                      ✓ One uppercase letter

                    </p>

                    <p
                      className={
                        passwordChecks.lowercase
                          ? "valid"
                          : "invalid"
                      }
                    >

                      ✓ One lowercase letter

                    </p>

                    <p
                      className={
                        passwordChecks.number
                          ? "valid"
                          : "invalid"
                      }
                    >

                      ✓ One number

                    </p>

                    <p
                      className={
                        passwordChecks.special
                          ? "valid"
                          : "invalid"
                      }
                    >

                      ✓ One special character

                    </p>

                  </div>

                )

              }

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
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

            <div className="password-field">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >

                {

                  showConfirmPassword

                    ?

                    <EyeOff size={18} />

                    :

                    <Eye size={18} />

                }

              </button>

            </div>

            <button
              type="submit"
              disabled={
                isRegistering ||
                !passwordValid
              }
            >

              {

                isRegistering

                  ?

                  "Creating Account..."

                  :

                  "Create Account"

              }

            </button>

          </form>

          <p className="register-link">

            Already have an account?

            <Link to="/login">

              Login

            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Register;