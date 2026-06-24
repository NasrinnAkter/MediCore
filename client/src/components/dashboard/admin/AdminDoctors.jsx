import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import {
  getDoctorsApi,
  createDoctorApi,
  updateDoctorApi,
  deleteDoctorApi,
} from "../../../services/doctorService.js";

const empty = {
  name: "",
  degree: "",
  role: "",
  department: "",
  bio: "",
  photo: "",
  schedule: [
    { day: "Monday", hours: "" },
    { day: "Tuesday", hours: "" },
    { day: "Wednesday", hours: "" },
    { day: "Thursday", hours: "" },
    { day: "Friday", hours: "" },
    { day: "Saturday", hours: "" },
    { day: "Sunday", hours: "" },
  ],
};

const departments = [
  "Cardiology",
  "Dermatology",
  "Gynaecology",
  "Neurology",
  "Nephrology",
  "Orthopaedics",
  "Oncology",
  "Ophthalmology",
  "Paediatrics",
  "Radiology & Imaging",
];

export default function AdminDoctors() {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await getDoctorsApi({}, token);
      setDoctors(data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [token]);

  const openAdd = () => {
    setForm(empty);
    setEditId(null);
    setModal(true);
  };

  const openEdit = (doc) => {
  const defaultDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const existingSchedule = defaultDays.map((day) => {
    const found = doc.schedule?.find((s) => s.day === day);
    return { day, hours: found?.hours || "" };
  });
  setForm({
    name: doc.name,
    degree: doc.degree || "",
    role: doc.role || "",
    department: doc.department,
    bio: doc.bio || "",
    photo: doc.photo || "",
    schedule: existingSchedule,
  });
  setEditId(doc._id);
  setModal(true);
};

  const handleSave = async () => {
    if (!form.name || !form.department) return;
    setSaving(true);
    try {
      if (editId) {
        await updateDoctorApi(editId, form, token);
      } else {
        await createDoctorApi(form, token);
      }
      await fetchDoctors();
      setModal(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoctorApi(deleteId, token);
      setDoctors((prev) => prev.filter((d) => d._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Manage Doctors
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
        >
          <FaPlus size={13} /> Add Doctor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Degree", "Role", "Department", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No doctors yet.
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary">{doc.name}</td>
                    <td className="px-5 py-4 text-gray-500">{doc.degree}</td>
                    <td className="px-5 py-4 text-gray-500">{doc.role}</td>
                    <td className="px-5 py-4 text-gray-500">{doc.department}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(doc)}
                          className="text-xs text-blue-500 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 flex items-center gap-1"
                        >
                          <FaEdit size={11} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(doc._id)}
                          className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 flex items-center gap-1"
                        >
                          <FaTrash size={11} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">
                {editId ? "Edit Doctor" : "Add New Doctor"}
              </h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-primary">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { field: "name", label: "Full Name", placeholder: "Dr. John Doe" },
                { field: "degree", label: "Degree", placeholder: "MBBS, FCPS (Neurology)" },
                { field: "role", label: "Role", placeholder: "Senior Consultant" },
                { field: "photo", label: "Photo URL", placeholder: "https://..." },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="text-sm font-medium text-primary block mb-1">{label}</label>
                  <input
                    value={form[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent bg-white"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Bio</label>
                <textarea
                  value={form.bio || ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  placeholder="Brief bio..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
  <label className="text-sm font-medium text-primary block mb-2">
    Schedule Hours
  </label>
  <div className="space-y-2">
    {form.schedule.map((item, idx) => (
      <div key={item.day} className="flex items-center gap-3">
        <span className="text-sm text-gray-500 w-24 flex-shrink-0">{item.day}</span>
        <input
          value={item.hours}
          onChange={(e) => {
            const updated = [...form.schedule];
            updated[idx] = { ...updated[idx], hours: e.target.value };
            setForm({ ...form, schedule: updated });
          }}
          placeholder='e.g. 09:00 AM - 08:00 PM or "Closed"'
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
    ))}
  </div>
</div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60"
              >
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Doctor"}
              </button>
              <button
                onClick={() => setModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-primary mb-2">Delete Doctor?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}