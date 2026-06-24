import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import {
  getServicesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
} from "../../../services/serviceService.js";

const iconOptions = ["Brain","Heart","Baby","Bone","Microscope","Eye","Stethoscope","Activity","Dna","Droplets"];
const empty = { name: "", icon: "", description: "", details: "", order: 0 };

export default function AdminServices() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await getServicesApi();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };

  const openEdit = (service) => {
    setForm({
      name: service.name,
      icon: service.icon,
      description: service.description,
      details: service.details?.join("\n") || "",
      order: service.order || 0,
    });
    setEditId(service._id);
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        details: form.details
          ? form.details.split("\n").map((d) => d.trim()).filter(Boolean)
          : [],
      };
      if (editId) {
        await updateServiceApi(editId, payload, token);
      } else {
        await createServiceApi(payload, token);
      }
      await fetchServices();
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
      await deleteServiceApi(deleteId, token);
      setServices((prev) => prev.filter((s) => s._id !== deleteId));
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
        <h1 className="text-2xl font-heading font-bold text-primary">Manage Services</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
          <FaPlus size={13} /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Icon", "Order", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No services yet.</td></tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary">{service.name}</td>
                    <td className="px-5 py-4 text-gray-500">{service.icon}</td>
                    <td className="px-5 py-4 text-gray-500">{service.order}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(service)} className="text-xs text-blue-500 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 flex items-center gap-1">
                          <FaEdit size={11} /> Edit
                        </button>
                        <button onClick={() => setDeleteId(service._id)} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 flex items-center gap-1">
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

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">{editId ? "Edit Service" : "Add New Service"}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-primary"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Service Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cardiology" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Icon</label>
                <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent bg-white">
                  <option value="">Select icon</option>
                  {iconOptions.map((icon) => (<option key={icon}>{icon}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">What We Offer <span className="text-gray-400 font-normal">(one item per line)</span></label>
                <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={5} placeholder={"ECG and echocardiography\nHeart failure management"} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Display Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60">
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Service"}
              </button>
              <button onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-primary mb-2">Delete Service?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-60">
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}