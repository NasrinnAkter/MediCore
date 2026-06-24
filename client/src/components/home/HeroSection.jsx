import { Link } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1600",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative min-h-[520px] overflow-hidden flex items-center">
        {/* Sliding Images */}
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: current === i ? 1 : 0,
            }}
          />
        ))}

        {/* Light overlay so text is readable */}
        <div className="absolute inset-0 bg-white/40" />

        {/* Decorative circle */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent/20 rounded-full -translate-x-16 -translate-y-16" />

        {/* Text Content */}
        <div className="relative z-10 px-8 md:px-20 py-16 max-w-xl">
          <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-3">
            Caring For Life
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary leading-tight mb-8">
            Leading the Way
            <br />
            in Medical Excellence
          </h1>
          <Link
            to="/specialties"
            className="inline-block bg-cardBg text-primary font-medium px-8 py-3 rounded-full hover:bg-accent hover:text-white transition-all duration-200"
          >
            Our Services
          </Link>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                current === i ? "bg-primary w-6" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Single Centered CTA Card */}
      <div className="flex justify-center -mt-6 relative z-10 px-6">
        <Link
          to="/appointment"
          className="flex items-center gap-4 bg-primary text-white px-12 py-5 shadow-lg hover:bg-primary/90 transition-all duration-200"
        >
          <span className="font-medium text-base">Book an Appointment</span>
          <FaCalendarAlt size={24} className="text-accent" />
        </Link>
      </div>
    </div>
  );
}
