import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const features = [
  "A Passion for Healing",
  "5-Star Care",
  "Provide our Best",
  "Believe in Us",
  "A Legacy of Excellence",
  "Always Caring",
];

const images = [
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
];

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/services");
        const data = await res.json();
        setServices(data);
        if (data.length > 0) setActiveId(data[0]._id);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleClick = (service) => {
    setActiveId(service._id);
    navigate("/specialties", { state: { selectedId: service._id } });
  };

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-2">
            Care You Can Believe In
          </p>
          <h2 className="text-4xl font-heading font-bold text-primary">
            Our Services and Specialties
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_280px] border border-gray-200 bg-white">
          {/* Left Sidebar */}
          <div className="flex flex-col border-r border-gray-200 overflow-y-auto max-h-[500px]">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Circle;
              return (
                <button
                  key={service._id}
                  onClick={() => handleClick(service)}
                  className={`flex flex-col items-center justify-center gap-2 py-6 px-4 border-b border-gray-200 transition-all duration-200 cursor-pointer
                    ${
                      activeId === service._id
                        ? "bg-primary text-white"
                        : "bg-white text-primary hover:bg-blue-50"
                    }`}
                >
                  <Icon size={24} className="text-accent" />
                  <span className="text-xs font-medium text-center">
                    {service.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Center Content */}
          <div className="p-8 md:p-10">
            <h3 className="text-2xl font-heading font-semibold text-primary mb-6">
              A passion for putting patients first.
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-accent flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Our services and specialties are designed around one simple goal —
              putting patients first. From preventive care to advanced
              diagnostics, every service at MediCore is delivered with
              precision, empathy, and the highest medical standards.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Whether you need a free general checkup, cardiac monitoring, DNA
              analysis, or emergency blood supply, our dedicated team is here
              for you every step of the way.
            </p>
            <button
              onClick={() => navigate("/specialties")}
              className="text-accent font-semibold hover:underline inline-flex items-center gap-1 text-sm"
            >
              View All Services →
            </button>
          </div>

          {/* Right Images */}
          <div className="flex flex-col">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`service-${i}`}
                className="w-full flex-1 object-cover"
                style={{ height: "250px" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
