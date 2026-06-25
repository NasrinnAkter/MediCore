import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewsPage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch main news list with filters
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 6 });
        if (search) params.append("search", search);
        if (selectedCategory) params.append("category", selectedCategory);

        const res = await fetch(`http://localhost:5000/api/news?${params}`);
        const data = await res.json();
        setNews(data.news);
        setTotal(data.total);
        setTotalPages(data.totalPages);

        // Build categories from results
        const cats = {};
        data.news.forEach((n) => {
          cats[n.category] = (cats[n.category] || 0) + 1;
        });
        setCategories(
          Object.entries(cats).map(([name, count]) => ({ name, count })),
        );
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchNews, 300);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, page]);

  // Fetch recent posts for sidebar (no filters, latest 4)
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/news?limit=4&page=1",
        );
        const data = await res.json();
        setRecentPosts(data.news);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecent();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setSelectedCategory(selectedCategory === cat ? "" : cat);
    setPage(1);
  };

  return (
    <div>
      {/* Banner */}
      <div
        className="relative py-10 sm:py-12 px-4 sm:px-6"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-50/80" />
        <div className="relative z-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#1B3C6B] font-semibold mb-4 hover:underline"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-[#1B3C6B] text-center">
            Blog Posts
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col lg:flex-row gap-10">
        {/* Main posts */}
        <div className="flex-1 space-y-12">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading posts...</p>
          ) : news.length === 0 ? (
            <p className="text-gray-500">No posts found.</p>
          ) : (
            news.map((post) => (
              <div key={post._id} className="border-b pb-10">
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded mb-5"
                  />
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#3AABBB] mb-2">
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
                </div>
                <h2 className="text-2xl font-bold text-[#1B3C6B] mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button
                  onClick={() => navigate(`/news/${post._id}`)}
                  className="border border-[#1B3C6B] text-[#1B3C6B] px-5 py-2 rounded hover:bg-[#1B3C6B] hover:text-white transition-colors duration-300"
                >
                  Read More →
                </button>
              </div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-2 justify-center pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors
                    ${page === p ? "bg-[#1B3C6B] text-white" : "border border-[#1B3C6B] text-[#1B3C6B] hover:bg-[#1B3C6B] hover:text-white"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
          {/* Search */}
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              className="flex-1 px-4 py-2 text-sm outline-none"
            />
            <button className="bg-[#1B3C6B] text-white px-4">🔍</button>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="text-lg font-bold text-[#1B3C6B] mb-4">
              Recent Posts
            </h3>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => navigate(`/news/${post._id}`)}
                  className="flex gap-3 items-start cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-14 h-14 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="text-xs text-[#3AABBB]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-[#1B3C6B] font-semibold leading-tight line-clamp-2">
                      {post.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-[#1B3C6B] mb-4">
              Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategory(cat.name)}
                  className={`w-full flex justify-between items-center px-4 py-2 rounded transition-colors
                    ${
                      selectedCategory === cat.name
                        ? "bg-[#1B3C6B] text-white"
                        : "bg-blue-50 hover:bg-[#1B3C6B] hover:text-white"
                    }`}
                >
                  <span className="text-sm">{cat.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full
                    ${selectedCategory === cat.name ? "bg-white text-[#1B3C6B]" : "bg-[#3AABBB] text-white"}`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
