import { FaPhone, FaClock, FaMapMarkerAlt } from "react-icons/fa";

export default function QuickContactBar() {
  return (
  <div className="bg-white border-b border-gray-100 py-3 px-6">
    <div className="max-w-7xl mx-auto flex justify-between items-center">

      {/* Left */}
      <p className="text-sm font-semibold text-primary">
        Welcome to <span className="text-accent">MediCore</span> Hospital
      </p>

      {/* Right — grouped */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <FaPhone className="text-accent text-lg" />
          <div>
            <p className="text-xs font-semibold text-textDark uppercase tracking-wide">Emergency</p>
            <p className="text-accent font-semibold text-sm">+880 2-1234567</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FaClock className="text-accent text-lg" />
          <div>
            <p className="text-xs font-semibold text-textDark uppercase tracking-wide">Work Hour</p>
            <p className="text-accent font-semibold text-sm">09:00 - 20:00 Everyday</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-accent text-lg" />
          <div>
            <p className="text-xs font-semibold text-textDark uppercase tracking-wide">Location</p>
            <p className="text-accent font-semibold text-sm">123 Airport Road, Dhaka</p>
          </div>
        </div>
      </div>

    </div>
  </div>
);
}
