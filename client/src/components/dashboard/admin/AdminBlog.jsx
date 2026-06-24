import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import {
  getAllNewsAdminApi,
  createNewsApi,
  updateNewsApi,
  deleteNewsApi,
} from "../../../services/newsService.js";

const empty = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  authorName: "",
  coverImage: "",
  tags: "",
  published: false,
};

const categories = [
  "Health Care",
  "Medical",
  "Surgery",
  "Professional",
  "Cardiology",
  "Neurology",
];

export default function AdminBlog() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await getAllNewsAdminApi(token);
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const openAdd = () => {
    setForm(empty);
    setEditId(null);
    setModal(true);
  };

  const openEdit = (post) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverImage: post.coverImage || "",
      tags: post.tags?.join(", ") || "",
      published: post.published,
    });
    setEditId(post._id);
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.excerpt || !form.content) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };
      if (editId) {
        await updateNewsApi(editId, payload, token);
      } else {
        await createNewsApi(payload, token);
      }
      await fetchPosts();
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
      await deleteNewsApi(deleteId, token);
      setPosts((prev) => prev.filter((p) => p._id !== deleteId));
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
          Manage Blog Posts
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
        >
          <FaPlus size={13} /> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Title", "Category", "Author", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No posts yet.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary max-w-xs truncate">{post.title}</td>
                    <td className="px-5 py-4 text-gray-500">{post.category}</td>
                    <td className="px-5 py-4 text-gray-500">{post.authorName || post.author?.name || "—"}</td>
                    <td className="px-5 py-4 text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.published ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(post)} className="text-xs text-blue-500 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 flex items-center gap-1">
                          <FaEdit size={11} /> Edit
                        </button>
                        <button onClick={() => setDeleteId(post._id)} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 flex items-center gap-1">
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
              <h3 className="text-lg font-bold text-primary">{editId ? "Edit Post" : "New Blog Post"}</h3>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-primary"><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
  <label className="text-sm font-medium text-primary block mb-1">Author Name</label>
  <input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} placeholder="Dr. John Doe" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
</div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent bg-white">
                  <option value="">Select category</option>
                  {categories.map((c) => (<option key={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Brief summary..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Content</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} placeholder="Full article content..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Cover Image URL</label>
                <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-sm font-medium text-primary block mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="health, cardiology, tips" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-primary w-4 h-4" />
                <label htmlFor="published" className="text-sm font-medium text-primary cursor-pointer">Publish immediately</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-60">
                {saving ? "Saving..." : editId ? "Save Changes" : "Create Post"}
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
            <h3 className="text-lg font-bold text-primary mb-2">Delete Post?</h3>
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