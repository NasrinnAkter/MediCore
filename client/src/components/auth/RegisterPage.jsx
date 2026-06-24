import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { registerApi } from "../../services/authService.js";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerApi({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dob,
        password: form.password,
      });

      login(
        { _id: data._id, name: data.name, email: data.email, role: data.role },
        data.token,
      );

      navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold font-heading">
            <span className="text-primary">MEDI</span>
            <span className="text-accent">CORE</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            Create your patient account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-primary block mb-1.5">
                  First Name
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                  <span className="px-3 text-gray-400">
                    <FaUser size={14} />
                  </span>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="flex-1 py-3 pr-4 text-sm outline-none text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1.5">
                  Last Name
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                  <span className="px-3 text-gray-400">
                    <FaUser size={14} />
                  </span>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="flex-1 py-3 pr-4 text-sm outline-none text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-primary block mb-1.5">
                  Email
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                  <span className="px-3 text-gray-400">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    required
                    className="flex-1 py-3 pr-2 text-sm outline-none text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1.5">
                  Phone
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                  <span className="px-3 text-gray-400">
                    <FaPhone size={14} />
                  </span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+880 1711..."
                    required
                    className="flex-1 py-3 pr-2 text-sm outline-none text-primary"
                  />
                </div>
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-accent transition-colors text-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">
                Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                <span className="px-3 text-gray-400">
                  <FaLock size={14} />
                </span>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="flex-1 py-3 text-sm outline-none text-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="px-3 text-gray-400 hover:text-primary"
                >
                  {showPass ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">
                Confirm Password
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent transition-colors">
                <span className="px-3 text-gray-400">
                  <FaLock size={14} />
                </span>
                <input
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="flex-1 py-3 text-sm outline-none text-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="px-3 text-gray-400 hover:text-primary"
                >
                  {showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-accent transition-all duration-200 mt-2 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}