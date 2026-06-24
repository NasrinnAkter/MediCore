import { useState } from "react";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";
import HeroBanner from "../../components/common/HeroBanner";
import { submitContactApi } from "../../services/contactService.js";

const contactCards = [
  {
    icon: <FaPhone size={24} />,
    title: "EMERGENCY",
    lines: ["+880 2-1234567", "+880 1711-000000"],
    highlight: false,
  },
  {
    icon: <FaMapMarkerAlt size={24} />,
    title: "LOCATION",
    lines: ["123 Airport Road", "Dhaka, Bangladesh"],
    highlight: true,
  },
  {
    icon: <FaEnvelope size={24} />,
    title: "EMAIL",
    lines: ["info@medicore.com.bd", "support@medicore.com"],
    highlight: false,
  },
  {
    icon: <FaClock size={24} />,
    title: "WORKING HOURS",
    lines: ["Sat-Thu 09:00-20:00", "Friday Emergency only"],
    highlight: false,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactApi(form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner
        title="Our Contacts"
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Contact", to: "/contact" },
        ]}
      />

      {/* Map - Fixed with a completely valid 'pb' token map string */}
      <div className="w-full h-96 overflow-hidden shadow-inner bg-gray-100">
        <iframe
          title="MediCore Bangladesh Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977782397!2d90.33688147287754!3d23.78077774431945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbd1b5c0e2!2sDhaka!5e0!3m2!1sen!2sbd!4v1717942000000!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Contact Form + Info Cards */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left — Form */}
            <div>
              <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-1">
                Get In Touch
              </p>
              <h2 className="text-4xl font-heading font-bold text-primary mb-8">
                Contact
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="border border-gray-200">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Name"
                      required
                      className="bg-primary/5 border-r border-b border-gray-200 px-5 py-4 text-sm text-primary placeholder-primary/60 outline-none focus:bg-cardBg transition-colors"
                    />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      type="email"
                      required
                      className="bg-primary/5 border-b border-gray-200 px-5 py-4 text-sm text-primary placeholder-primary/60 outline-none focus:bg-cardBg transition-colors"
                    />
                  </div>

                  {/* Row 2 */}
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    className="w-full bg-primary/5 border-b border-gray-200 px-5 py-4 text-sm text-primary placeholder-primary/60 outline-none focus:bg-cardBg transition-colors block"
                  />

                  {/* Row 3 — Message */}
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Message"
                    rows={7}
                    required
                    className="w-full bg-primary/5 border-b border-gray-200 px-5 py-4 text-sm text-primary placeholder-primary/60 outline-none focus:bg-cardBg transition-colors resize-none block"
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-cardBg text-primary font-semibold tracking-widest py-4 hover:bg-primary hover:text-white transition-all duration-200 text-sm uppercase cursor-pointer"
                  >
                    {submitted ? "✓ Message Sent!" : "Submit"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right — Info Cards 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactCards.map(({ icon, title, lines, highlight }) => (
                <div
                  key={title}
                  className={`rounded-lg p-6 flex flex-col gap-4 ${
                    highlight
                      ? "bg-primary text-white"
                      : "bg-cardBg text-primary"
                  }`}
                >
                  <div className={highlight ? "text-white" : "text-primary"}>
                    {icon}
                  </div>
                  <div>
                    <p className="font-bold text-xs tracking-widest mb-2">
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
        </div>
      </section>
    </div>
  );
}
