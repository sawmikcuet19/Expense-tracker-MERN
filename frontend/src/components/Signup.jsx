import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import axios from "axios";
import { signupStyles } from "../assets/dummyStyles";

const API_BASE = "http://localhost:4000/api";

const Signup = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/user/register`, { name, email, password });
      if (res.data.success) {
        onSignup(res.data.user, res.data.token, true);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err?.response || err);
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        "Signup failed";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      <div className={signupStyles.cardContainer}>
        <div className={signupStyles.header}>
          <Link to="/login" className={signupStyles.backButton}>
            <ArrowLeft size={20} />
          </Link>
          <div className={signupStyles.avatar}>
             <UserPlus size={40} className="text-teal-600" />
          </div>
          <h1 className={signupStyles.headerTitle}>Create Account</h1>
          <p className={signupStyles.headerSubtitle}>Join us to start tracking your expenses</p>
        </div>

        <form onSubmit={handleSignup} className={signupStyles.formContainer}>
          {error && <p className={signupStyles.apiError}>{error}</p>}

          <div className="mb-4">
            <label className={signupStyles.label}>Full Name</label>
            <div className={signupStyles.inputContainer}>
              <User className={signupStyles.inputIcon} size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={signupStyles.input}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className={signupStyles.label}>Email Address</label>
            <div className={signupStyles.inputContainer}>
              <Mail className={signupStyles.inputIcon} size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={signupStyles.input}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className={signupStyles.label}>Password</label>
            <div className={signupStyles.inputContainer}>
              <Lock className={signupStyles.inputIcon} size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={signupStyles.passwordInput}
                placeholder="********"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={signupStyles.passwordToggle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${signupStyles.button} ${isLoading ? signupStyles.buttonDisabled : ""}`}
          >
            {isLoading ? (
              <svg className={signupStyles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className={signupStyles.signInContainer}>
            <p className={signupStyles.signInText}>
              Already have an account?{" "}
              <Link to="/login" className={signupStyles.signInLink}>
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
