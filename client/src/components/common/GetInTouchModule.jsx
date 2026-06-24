import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";

const cards = [
  {
    icon: <FaPhone size={28} />,
    title: "EMERGENCY",
    lines: ["+880 2-1234567", "+880 1711-000000"],
    highlight: false,
  },
  {
    icon: <FaMapMarkerAlt size={28} />,
    title: "LOCATION",
    lines: ["123 Airport Road", "Dhaka, Bangladesh"],
    highlight: true,
  },
  {
    icon: <FaEnvelope size={28} />,
    title: "EMAIL",
    lines: ["info@medicore.com.bd", "support@medicore.com"],
    highlight: false,
  },
  {
    icon: <FaClock size={28} />,
    title: "WORKING HOURS",
    lines: ["Sat-Thu 09:00-20:00", "Friday Emergency only"],
    highlight: false,
  },
];

export default function GetInTouchModule() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-accent uppercase tracking-widest text-sm font-semibold mb-1">
            GET IN TOUCH
          </p>
          <h2 className="text-4xl font-heading font-bold text-primary">
            Contact
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ icon, title, lines, highlight }) => (
            <div
              key={title}
              className={`rounded-lg p-8 flex flex-col gap-4 ${
                highlight ? "bg-primary text-white" : "bg-cardBg text-primary"
              }`}
            >
              <div className={highlight ? "text-white" : "text-primary"}>
                {icon}
              </div>
              <div>
                <p className="font-bold text-sm tracking-widest mb-2">
                  {title}
                </p>
                {lines.map((line) => (
                  <p
                    key={line}
                    className={`text-sm ${highlight ? "text-blue-200" : "text-gray-600"}`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
