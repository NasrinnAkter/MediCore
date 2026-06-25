import { useState, useEffect } from "react";
import { FaCalendarAlt, FaCheckCircle, FaClock } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { getPatientStatsApi } from "../../../services/authService.js";
import { getMyAppointmentsApi } from "../../../services/appointmentService.js";

const statusStyle = {
  confirmed: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  completed: "bg-blue-100 text-blue-600",
  cancelled: "bg-red-100 text-red-500",
};

export default function PatientOverview({ setActive }) {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ upcoming: 0, past: 0, pending: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replaced manual fetch statements with cleaner centralized API methods
        const [statsData, aptsData] = await Promise.all([
          getPatientStatsApi(token),
          getMyAppointmentsApi(token),
        ]);

        setStats(statsData);

        // Show only upcoming appointments in overview (max 3)
        const upcoming = aptsData
          .filter((a) => a.status === "pending" || a.status === "confirmed")
          .slice(0, 3);
        setAppointments(upcoming);
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const statCards = [
    {
      label: "Upcoming Appointments",
      value: stats.upcoming,
      icon: FaCalendarAlt,
      color: "bg-blue-50 text-primary",
    },
    {
      label: "Total Past Visits",
      value: stats.past,
      icon: FaCheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Requests",
      value: stats.pending,
      icon: FaClock,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's a summary of your health activity.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
            >
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-heading font-bold text-primary">
            Upcoming Appointments
          </h2>
          <button
            onClick={() => setActive("appointments")}
            className="text-accent text-sm font-medium hover:underline"
          >
            View All →
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            No upcoming appointments.
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-primary font-medium text-sm">
                    {apt.doctor?.name || "Unknown Doctor"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {apt.doctor?.department}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-sm font-medium">
                    {new Date(apt.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-xs">{apt.time}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[apt.status]}`}
                >
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
