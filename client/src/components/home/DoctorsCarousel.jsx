import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function DoctorsCarousel() {
  const [doctors, setDoctors] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const slidesToShow = 3;
  const maxStartIndex = Math.max(0, doctors.length - slidesToShow);
  const visible = doctors.slice(startIndex, startIndex + slidesToShow);
  const totalSteps = Array.from({ length: maxStartIndex + 1 });

  const prev = () => setStartIndex((i) => Math.max(i - 1, 0));
  const next = () => setStartIndex((i) => Math.min(i + 1, maxStartIndex));

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-2">
            Trusted Care
          </p>
          <h2 className="text-4xl font-heading font-bold text-primary">
            Our Doctors
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No doctors available.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visible.map((doc) => (
                <div
                  key={doc._id}
                  className="rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={
                        doc.photo ||
                        "https://via.placeholder.com/400x288?text=Doctor"
                      }
                      alt={doc.name}
                      className="w-full h-72 object-cover object-top"
                    />
                    <div className="bg-cardBg px-6 py-5 text-center">
                      <p className="text-primary font-medium text-lg mb-1">
                        {doc.name}
                      </p>
                      <p className="text-primary font-bold text-xs tracking-widest mb-1 uppercase">
                        {doc.specialty}
                      </p>
                      <p className="text-accent text-xs mb-3">
                        {doc.department}
                      </p>
                      <div className="flex justify-center gap-3">
                        {[FaLinkedinIn, FaFacebookF, FaInstagram].map(
                          (Icon, j) => (
                            <a
                              key={j}
                              href="#"
                              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white text-primary transition-all"
                            >
                              <Icon size={13} />
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/doctors/${doc._id}`)}
                    className="block w-full bg-primary text-white text-center py-4 text-sm font-medium hover:bg-accent transition-colors duration-200"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            {doctors.length > slidesToShow && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={prev}
                  disabled={startIndex === 0}
                  className="w-9 h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft size={13} />
                </button>

                {totalSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStartIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      i === startIndex ? "bg-primary w-5" : "bg-gray-300 w-2.5"
                    }`}
                  />
                ))}

                <button
                  onClick={next}
                  disabled={startIndex >= maxStartIndex}
                  className="w-9 h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <FaChevronRight size={13} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
