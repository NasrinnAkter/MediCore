import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setPost(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center text-gray-400">Loading...</div>;
  if (notFound || !post)
    return <div className="p-10 text-center">Article not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <button
        onClick={() => navigate("/news")}
        className="flex items-center gap-2 text-[#1B3C6B] font-semibold mb-8 hover:underline"
      >
        ← Back to News
      </button>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-80 object-cover rounded mb-8"
        />
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-[#3AABBB] mb-4">
        <span>
          📅{" "}
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span>✍️ By {post.authorName || post.author?.name || "MediCore"}</span>
        <span className="bg-[#3AABBB] text-white px-3 py-1 rounded-full text-xs">
          {post.category}
        </span>
        {post.tags?.length > 0 && (
          <span className="text-gray-400 text-xs">
            🏷 {post.tags.join(", ")}
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#1B3C6B] mb-6">
        {post.title}
      </h1>

      <div className="text-gray-600 leading-8 whitespace-pre-line">
        {post.content}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/appointment")}
          className="bg-[#1B3C6B] text-white px-6 py-2 rounded hover:bg-[#3AABBB] transition-colors duration-300"
        >
          Book an Appointment
        </button>
        <button
          onClick={() => navigate("/news")}
          className="border border-[#1B3C6B] text-[#1B3C6B] px-6 py-2 rounded hover:bg-[#1B3C6B] hover:text-white transition-colors duration-300"
        >
          ← Back to News
        </button>
      </div>
    </div>
  );
};

export default NewsDetailPage;
