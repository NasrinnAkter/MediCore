import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DoctorGrid from "../../components/doctors/DoctorGrid";
import { getDoctorsApi } from "../../services/doctorService.js";

const departments = [
  "All",
  "Cardiology",
  "Dermatology",
  "Gynaecology",
  "Neurology",
  "Nephrology",
  "Orthopaedics",
  "Oncology",
  "Ophthalmology",
  "Paediatrics",
  "Radiology & Imaging",
];

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedDept, setSelectedDept] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (selectedDept !== "All") params.department = selectedDept;
        const data = await getDoctorsApi(params);
        setDoctors(data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timer);
  }, [search, selectedDept]);

  return (
    <div>
      <div
        className="relative py-10 sm:py-12 px-4 sm:px-6"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-blue-50/80" />
        <div className="relative z-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#1B3C6B] font-semibold mb-4 hover:underline">
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-[#1B3C6B] text-center">Our Doctors</h1>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-72 border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#3AABBB] text-[#1B3C6B] cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept === "All" ? "All departments" : dept}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by doctor name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm outline-none focus:border-[#3AABBB]"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading doctors...</p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              Showing <span className="font-bold text-[#1B3C6B]">{doctors.length}</span> doctors
            </p>
            <DoctorGrid filtered={doctors} />
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;