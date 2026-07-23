import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";
import "../styles/ForgotPassword.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordValid =
    Object.values(passwordChecks).every(Boolean);

  const getPasswordStrength = () => {

    if (password.length < 6)
      return { text: "Weak", className: "weak" };

    if (password.length >= 6 && password.length < 10)
      return { text: "Medium", className: "medium" };

    return { text: "Strong", className: "strong" };

  };

  const passwordStrength = getPasswordStrength();

  const handleSendCode = async (e) => {

    e.preventDefault();
    setIsSending(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setStep(2);

    } finally {

      setIsSending(false);

    }

  };

  const handleResendCode = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("A new code has been sent.");

    } catch {

      toast.error("Failed to resend code.");

    }

  };

  const handleVerifyCode = async (e) => {

    e.preventDefault();
    setIsVerifying(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/verify-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setResetToken(data.resetToken);
      toast.success(data.message);
      setStep(3);

    } finally {

      setIsVerifying(false);

    }

  };

  const handleResetPassword = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!passwordValid) {
      toast.error("Please create a stronger password.");
      return;
    }

    setIsResetting(true);

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetToken, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      navigate("/login");

    } finally {

      setIsResetting(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-layout">

        <div className="login-showcase">

          <div className="showcase-content">

            <span>🧶 Knot & Bloom</span>

            <h2>Let's get you back in.</h2>

            <p>
              Reset your password in a few simple steps and get
              back to your handmade favorites.
            </p>

          </div>

        </div>

        <div className="login-card">

          <div className="login-header">

            <h1>

              {step === 1 && "Forgot Password 🔒"}
              {step === 2 && "Verify Your Email ✉️"}
              {step === 3 && "Create New Password 🔑"}

            </h1>

            <p>

              {step === 1 && "Enter your registered email to receive a verification code."}
              {step === 2 && `Enter the 6-digit code sent to ${email}`}
              {step === 3 && "Choose a strong new password for your account."}

            </p>

          </div>

          <div className="reset-steps">

            <div className={`reset-step ${step >= 1 ? "active" : ""}`}>1</div>
            <div className="reset-step-line" />
            <div className={`reset-step ${step >= 2 ? "active" : ""}`}>2</div>
            <div className="reset-step-line" />
            <div className={`reset-step ${step >= 3 ? "active" : ""}`}>3</div>

          </div>

          {step === 1 && (

            <form className="login-form" onSubmit={handleSendCode}>

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" disabled={isSending}>
                {isSending ? "Sending Code..." : "Send Verification Code"}
              </button>

            </form>

          )}

          {step === 2 && (

            <form className="login-form" onSubmit={handleVerifyCode}>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="code-input"
                required
              />

              <button type="submit" disabled={isVerifying || code.length !== 6}>
                {isVerifying ? "Verifying..." : "Verify Code"}
              </button>

              <p className="resend-text">
                Didn't get the code?
                <span onClick={handleResendCode}> Resend Code</span>
              </p>

            </form>

          )}

          {step === 3 && (

            <form className="login-form" onSubmit={handleResetPassword}>

              <div className="password-field">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

              </div>

              {password.length > 0 && (

                <div className={`password-strength ${passwordStrength.className}`}>
                  Password Strength: <strong> {passwordStrength.text}</strong>
                </div>

              )}

              {password.length > 0 && (

                <div className="password-checklist">

                  <p className={passwordChecks.length ? "valid" : "invalid"}>
                    ✓ At least 8 characters
                  </p>

                  <p className={passwordChecks.uppercase ? "valid" : "invalid"}>
                    ✓ One uppercase letter
                  </p>

                  <p className={passwordChecks.lowercase ? "valid" : "invalid"}>
                    ✓ One lowercase letter
                  </p>

                  <p className={passwordChecks.number ? "valid" : "invalid"}>
                    ✓ One number
                  </p>

                  <p className={passwordChecks.special ? "valid" : "invalid"}>
                    ✓ One special character
                  </p>

                </div>

              )}

              <div className="password-field">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>

              </div>

              <button type="submit" disabled={isResetting || !passwordValid}>
                {isResetting ? "Resetting..." : "Reset Password"}
              </button>

            </form>

          )}

          <p className="register-link">
            Remembered your password?
            <Link to="/login"> Back to Login</Link>
          </p>

        </div>

      </div>

    </div>

  );

}

export default ForgotPassword;