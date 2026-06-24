import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getDoctorsApi } from "../../services/doctorService.js";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [news, setNews] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [doctorsData, newsRes, servicesRes] = await Promise.all([
          getDoctorsApi({ search: query }),
          fetch(`http://localhost:5000/api/news?search=${encodeURIComponent(query)}&limit=6`),
          fetch(`http://localhost:5000/api/services`),
        ]);

        const newsData = await newsRes.json();
        const servicesData = await servicesRes.json();

        setDoctors(doctorsData);
        setNews(newsData.news || []);
        setServices(
          servicesData.filter((s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.description.toLowerCase().includes(query.toLowerCase())
          )
        );
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [query]);

  const total = doctors.length + news.length + services.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => navigate(-1)} className="text-[#1B3C6B] font-semibold mb-6 hover:underline flex items-center gap-2">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-[#1B3C6B] mb-2">
        Search Results for "{query}"
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Found <span className="font-bold text-[#1B3C6B]">{total}</span> results
      </p>

      {loading ? (
        <p className="text-gray-400 text-sm">Searching...</p>
      ) : total === 0 ? (
        <p className="text-gray-500">No results found for "{query}".</p>
      ) : (
        <div className="space-y-10">
          {/* Doctors */}
          {doctors.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#1B3C6B] mb-4 border-b pb-2">
                Doctors ({doctors.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => navigate(`/doctors/${doc._id}`)}
                    className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <img
                      src={doc.photo || "https://via.placeholder.com/60?text=Dr"}
                      alt={doc.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-[#1B3C6B] text-sm">{doc.name}</p>
                      <p className="text-[#3AABBB] text-xs">{doc.role}</p>
                      <p className="text-gray-400 text-xs">{doc.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#1B3C6B] mb-4 border-b pb-2">
                Services ({services.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => navigate("/specialties")}
                    className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <p className="font-bold text-[#1B3C6B] text-sm">{s.name}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {news.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#1B3C6B] mb-4 border-b pb-2">
                News ({news.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => navigate(`/news/${post._id}`)}
                    className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-[#1B3C6B] text-sm line-clamp-2">{post.title}</p>
                      <p className="text-gray-400 text-xs mt-1">{post.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;