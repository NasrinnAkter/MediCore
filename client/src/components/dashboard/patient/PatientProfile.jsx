import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import {
  updateProfileApi,
  changePasswordApi,
} from "../../../services/authService.js";

export default function PatientProfile() {
  const { user, token, login } = useAuth();
  const [tab, setTab] = useState("info");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [passError, setPassError] = useState("");
  const [passSaved, setPassSaved] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Load current user data into form
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
      });
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileError("");

    try {
      const data = await updateProfileApi(profile, token);

      // Update context with new data
      login({ ...user, name: data.name, email: data.email }, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPassError("");

    if (passwords.newPass !== passwords.confirm) {
      setPassError("Passwords do not match.");
      return;
    }
    if (passwords.newPass.length < 6) {
      setPassError("Minimum 6 characters.");
      return;
    }

    setPassLoading(true);
    try {
      await changePasswordApi(
        {
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        },
        token,
      );

      setPassSaved(true);
      setPasswords({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPassSaved(false), 3000);
    } catch (err) {
      setPassError(err.message);
    } finally {
      setPassLoading(false);
    }
  };

  const toggleShow = (field) =>
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-primary mb-6">
        My Profile
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "info", label: "Personal Information" },
          { id: "password", label: "Change Password" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                ${tab === id ? "bg-primary text-white" : "bg-white text-primary border border-gray-200 hover:border-primary"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        {/* Personal Info */}
        {tab === "info" && (
          <form onSubmit={handleProfileSave} className="space-y-5">
            {saved && (
              <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">
                ✓ Profile updated!
              </div>
            )}
            {profileError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {profileError}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">
                Full Name
              </label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent">
                <span className="px-3 text-gray-400">
                  <FaUser size={14} />
                </span>
                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="flex-1 py-3 pr-4 text-sm outline-none text-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-primary block mb-1.5">
                  Email
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent">
                  <span className="px-3 text-gray-400">
                    <FaEnvelope size={14} />
                  </span>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="flex-1 py-3 pr-2 text-sm outline-none text-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1.5">
                  Phone
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent">
                  <span className="px-3 text-gray-400">
                    <FaPhone size={14} />
                  </span>
                  <input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="flex-1 py-3 pr-2 text-sm outline-none text-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-primary block mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) =>
                  setProfile({ ...profile, dateOfBirth: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-accent text-primary"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-accent transition-all text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {/* Change Password */}
        {tab === "password" && (
          <form onSubmit={handlePasswordSave} className="space-y-5">
            {passError && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                {passError}
              </div>
            )}
            {passSaved && (
              <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">
                ✓ Password changed!
              </div>
            )}

            {[
              {
                field: "current",
                label: "Current Password",
                placeholder: "Enter current password",
              },
              {
                field: "newPass",
                label: "New Password",
                placeholder: "Min. 6 characters",
              },
              {
                field: "confirm",
                label: "Confirm Password",
                placeholder: "Repeat new password",
              },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="text-sm font-medium text-primary block mb-1.5">
                  {label}
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-accent">
                  <span className="px-3 text-gray-400">
                    <FaLock size={14} />
                  </span>
                  <input
                    type={showPass[field] ? "text" : "password"}
                    value={passwords[field]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [field]: e.target.value })
                    }
                    placeholder={placeholder}
                    required
                    className="flex-1 py-3 text-sm outline-none text-primary"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(field)}
                    className="px-3 text-gray-400 hover:text-primary"
                  >
                    {showPass[field] ? (
                      <FaEyeSlash size={14} />
                    ) : (
                      <FaEye size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={passLoading}
              className="bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-accent transition-all text-sm disabled:opacity-60"
            >
              {passLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
