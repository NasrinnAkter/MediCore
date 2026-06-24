import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../services/authService.js";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to where they came from, or role-based dashboard
  const from = location.state?.from || null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // Replaced the manual fetch block with your clean auth service utility
      const data = await loginApi(form.email, form.password);

      // Store user and token via context
      login(
        { _id: data._id, name: data.name, email: data.email, role: data.role },
        data.token,
      );

      // Redirect based on role
      if (from) {
        navigate(from);
      } else if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold font-heading">
            <span className="text-primary">MEDI</span>
            <span className="text-accent">CORE</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">
                Email Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                <span className="px-3 text-gray-400">
                  <FaEnvelope size={15} />
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="flex-1 py-3 pr-4 text-sm outline-none text-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">
                Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                <span className="px-3 text-gray-400">
                  <FaLock size={15} />
                </span>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="flex-1 py-3 text-sm outline-none text-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="px-3 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-accent transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-gray-400 text-xs">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-accent font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
