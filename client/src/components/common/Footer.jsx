import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import { useState } from "react";

const importantLinks = [
  { label: "Appointment", to: "/appointment" },
  { label: "Doctors", to: "/doctors" },
  { label: "Services", to: "/specialties" },
  { label: "About Us", to: "/about" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = () => {
    if (!email) return;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=info@medicore.com.bd&su=${encodeURIComponent("Newsletter Subscription")}&body=${encodeURIComponent(`Please subscribe me to the MediCore newsletter.\n\nEmail: ${email}`)}`;
    window.open(gmailUrl, "_blank");
    setEmail("");
  };

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="text-3xl font-heading font-bold mb-4">MEDICORE</h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Leading the Way in Medical Excellence, Trusted Care.
          </p>
        </div>

        {/* Important Links */}
        <div>
          <h4 className="font-semibold text-base mb-5">Important Links</h4>
          <ul className="space-y-3">
            {importantLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-blue-200 text-sm hover:text-accent transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="font-semibold text-base mb-5">Contact Us</h4>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li>Call: +880 2-1234567</li>
            <li>Email: info@medicore.com.bd</li>
            <li>Address: 123 Airport Road</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-base mb-5">Newsletter</h4>
          <div className="flex items-center bg-white/10 rounded-md overflow-hidden border border-white/20">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-transparent text-sm text-white placeholder-blue-300 px-4 py-3 outline-none"
            />
            <button
              onClick={handleNewsletter}
              className="bg-accent px-4 py-3 hover:bg-cyan-400 transition-colors"
            >
              <FaEnvelope className="text-white" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-4">
          <p className="text-blue-200 text-sm">
            © 2026 MediCore All Rights Reserved
          </p>
          <div className="flex items-center gap-3">
            {[FaLinkedinIn, FaFacebookF, FaInstagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Icon size={15} className="text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}