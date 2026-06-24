import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaClock, FaPhoneAlt, FaAmbulance } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getDoctorsApi } from "../../services/doctorService.js";
import { createAppointmentApi } from "../../services/appointmentService.js";

const AppointmentPage = () => {
  const navigate = useNavigate();
  const { token, isLoggedIn, isAdmin } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    gender: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    doctor: "",
    department: "",
    message: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/appointment" } });
    }
  }, [isLoggedIn, navigate]);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctorsApi();
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Handle form changes + auto-fill department when doctor is selected
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "doctor") {
      const selectedDoctor = doctors.find((d) => d._id === value);
      setFormData((prev) => ({
        ...prev,
        doctor: value,
        department: selectedDoctor ? selectedDoctor.department : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    // 🚫 Block admin from booking
  if (isAdmin) {
    setErrorMsg("Admin accounts are not allowed to book appointments.");
    return;
  }
    if (!formData.doctor) {
      setErrorMsg("Please select a doctor");
      return;
    }

    setSubmitting(true);

    try {
      await createAppointmentApi(formData, token);

      setSuccessMsg(
        "Appointment booked successfully! We will confirm within 24 hours.",
      );

      // Reset form
      setFormData({
        patientName: "",
        gender: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        doctor: "",
        department: "",
        message: "",
      });
    } catch (err) {
      setErrorMsg(err.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctor = doctors.find((d) => d._id === formData.doctor);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <div className="mb-3">
            <p className="text-[#4bc8e8] text-sm md:text-base">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              / Appointment
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Book an <span className="text-[#1b3a6b]">Appointment</span>
          </h1>
          <p className="text-gray-600 max-w-full text-base md:text-lg leading-relaxed">
            Request an appointment with our expert doctors at your convenience.
            Fill out the form and we will confirm your preferred date and time
            within 24 hours.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* LEFT: Appointment Form */}
          <div className="lg:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-full border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#1b3a6b] rounded-full"></span>
                Appointment Form
              </h2>

              {/* Success / Error messages */}
              {successMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Preferred Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                      required
                    >
                      <option value="">Select Time</option>
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                      <option>01:00 PM</option>
                      <option>02:00 PM</option>
                      <option>03:00 PM</option>
                      <option>04:00 PM</option>
                      <option>05:00 PM</option>
                      <option>06:00 PM</option>
                      <option>07:00 PM</option>
                      <option>08:00 PM</option>
                    </select>
                  </div>

                  {/* Doctor Dropdown */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Doctor
                    </label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                      required
                    >
                      <option value="" disabled>
                        {loadingDoctors
                          ? "Loading doctors..."
                          : "Select Doctor"}
                      </option>
                      {doctors.map((doc) => (
                        <option key={doc._id} value={doc._id}>
                          {doc.name} — {doc.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department (auto-filled) */}
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      readOnly
                      placeholder="Auto-filled when doctor is selected"
                      className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-600 outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-1 font-medium">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Any additional information..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4bc8e8] focus:border-[#1b3a6b] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto bg-[#1b3a6b] hover:bg-[#0f2a4a] disabled:opacity-60 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
                >
                  {submitting ? "Submitting..." : "SUBMIT"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Schedule + Emergency */}
          <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col border border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                  <FaClock className="text-[#4bc8e8] text-xl" />
                  {selectedDoctor
                    ? `${selectedDoctor.name}'s Schedule`
                    : "Schedule Hours"}
                </h2>
                {selectedDoctor ? (
  <div className="space-y-2">
    <p className="text-sm font-semibold text-[#1b3a6b] mb-3">
      {selectedDoctor.name}'s Schedule
    </p>
    {selectedDoctor.schedule?.length > 0 ? (
      selectedDoctor.schedule.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50">
          <span className="font-semibold text-gray-700 text-sm">{item.day}</span>
          <span className={`font-medium text-sm ${item.hours === "Closed" || !item.hours ? "text-red-500" : "text-[#1b3a6b]"}`}>
            {item.hours || "Closed"}
          </span>
        </div>
      ))
    ) : (
      <p className="text-gray-400 text-sm">No schedule available.</p>
    )}
  </div>
) : (
  <div className="text-center py-8 text-gray-400">
    Please select a doctor to view schedule
  </div>
)}
              </div>

              <div className="border-t border-gray-200 my-6 relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-white px-2 text-xs text-gray-400">
                  24/7
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-[#d6e4f7] to-[#c0d4f0] rounded-xl p-5 shadow-inner">
                <div className="flex items-center gap-3 mb-2">
                  <FaAmbulance className="text-[#1b3a6b] text-4xl animate-pulse" />
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1b3a6b]">
                    Emergency
                  </h2>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#1b3a6b] mt-1 break-words flex items-center gap-2">
                  <FaPhoneAlt className="text-xl" /> +880 2-1234567
                </p>
                <p className="text-gray-700 mt-3 text-sm font-medium">
                  ⚡ 24/7 – Immediate assistance available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
