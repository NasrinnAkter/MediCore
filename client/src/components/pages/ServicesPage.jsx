import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Brain,
  Heart,
  Baby,
  Bone,
  Microscope,
  Eye,
  Stethoscope,
  Activity,
  Dna,
  Droplets,
  Circle,
} from "lucide-react";

// Map icon string names (stored in DB) to actual Lucide components
const iconMap = {
  Brain,
  Heart,
  Baby,
  Bone,
  Microscope,
  Eye,
  Stethoscope,
  Activity,
  Dna,
  Droplets,
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedId = location.state?.selectedId;

  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/services");
        const data = await res.json();
        setServices(data);
        // Select by id from navigation state, or default to first
        const initial = selectedId
          ? data.find((s) => s._id === selectedId) || data[0]
          : data[0];
        setSelected(initial);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedId]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">Loading services...</div>
    );
  if (!selected)
    return <div className="p-10 text-center">No services found.</div>;

  return (
    <div>
      {/* Banner */}
      <div
        className="relative py-10 sm:py-12 px-4 sm:px-6 text-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80)",
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
          <h1 className="text-4xl font-bold text-[#1B3C6B]">
            Our Services and Specialties
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col lg:flex-row gap-8">
        {/* Sidebar grid */}
        <div className="w-full lg:w-72 flex-shrink-0 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-3 h-fit">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Circle;
            return (
              <button
                key={service._id}
                onClick={() => setSelected(service)}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border transition-colors duration-200 cursor-pointer
                  ${
                    selected._id === service._id
                      ? "bg-[#1B3C6B] text-white border-[#1B3C6B]"
                      : "bg-white text-[#1B3C6B] border-gray-200 hover:border-[#3AABBB] hover:text-[#3AABBB]"
                  }`}
              >
                <Icon size={24} className="mb-1 sm:mb-2" />
                <span className="text-xs font-semibold text-center leading-tight">
                  {service.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="flex-1 bg-blue-50 rounded-lg p-6 sm:p-8">
          {(() => {
            const Icon = iconMap[selected.icon] || Circle;
            return (
              <>
                <Icon size={40} className="text-[#3AABBB] mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#1B3C6B] mb-3">
                  {selected.name}
                </h2>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  {selected.description}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-[#1B3C6B] mb-3">
                  What We Offer
                </h3>
                <ul className="space-y-2 mb-8">
                  {selected.details?.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-600 text-sm sm:text-base"
                    >
                      <span className="text-[#3AABBB] font-bold">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/appointment")}
                  className="w-full sm:w-auto bg-[#1B3C6B] text-white px-6 py-2 rounded hover:bg-[#3AABBB] transition-colors duration-300"
                >
                  Book Appointment
                </button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
