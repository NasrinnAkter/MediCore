import { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserMd,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { getAdminStatsApi } from "../../../services/authService.js";
import { getAppointmentsApi } from "../../../services/appointmentService.js";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-600",
  confirmed: "bg-green-100 text-green-600",
  completed: "bg-blue-100 text-blue-600",
  cancelled: "bg-red-100 text-red-500",
};

export default function AdminOverview({ setActive }) {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    completedToday: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replaced custom fetch statements with cleaner centralized API methods
        const [statsData, aptsData] = await Promise.all([
          getAdminStatsApi(token),
          getAppointmentsApi(token),
        ]);

        setStats(statsData);
        setRecentAppointments(aptsData.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch admin overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const statCards = [
    {
      label: "Total Patients",
      value: stats.totalPatients,
      icon: FaUsers,
      color: "bg-blue-50 text-primary",
    },
    {
      label: "Total Doctors",
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: "bg-teal-50 text-accent",
    },
    {
      label: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaCalendarAlt,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Completed Today",
      value: stats.completedToday,
      icon: FaCheckCircle,
      color: "bg-green-50 text-green-600",
    },
  ];

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-heading font-bold text-primary">
            Recent Appointments
          </h2>
          <button
            onClick={() => setActive("appointments")}
            className="text-accent text-sm font-medium hover:underline"
          >
            View All →
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Patient", "Doctor", "Department", "Time", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentAppointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No appointments yet.
                </td>
              </tr>
            ) : (
              recentAppointments.map((apt) => (
                <tr
                  key={apt._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-primary">
                    {apt.patient?.name || apt.patientName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {apt.doctor?.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{apt.department}</td>
                  <td className="px-4 py-3 text-gray-500">{apt.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[apt.status]}`}
                    >
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
