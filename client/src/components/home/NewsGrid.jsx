import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewsGrid() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/news?limit=4&page=1",
        );
        const data = await res.json();
        setNews(data.news);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-2">
            Better Information, Better Health
          </p>
          <h2 className="text-4xl font-heading font-bold text-primary">News</h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No news posts yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/news/${item._id}`)}
                className="flex gap-4 items-start cursor-pointer group"
              >
                {item.coverImage && (
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-32 h-24 object-cover rounded flex-shrink-0 group-hover:opacity-80 transition-opacity"
                  />
                )}
                <div>
                  <p className="text-accent text-xs mb-1">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    | By {item.author?.name || "MediCore"}
                  </p>
                  <p className="text-primary font-medium text-sm mb-2 leading-snug group-hover:text-accent transition-colors">
                    {item.title}
                  </p>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/news")}
            className="border-2 border-primary text-primary font-semibold px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-200"
          >
            View All News →
          </button>
        </div>
      </div>
    </section>
  );
}
