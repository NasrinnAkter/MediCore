import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <img
        src={doctor.photo || "https://via.placeholder.com/112x128?text=Doctor"}
        alt={doctor.name}
        className="w-36 h-40 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-bold text-[#1B3C6B]">{doctor.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{doctor.specialty}</p>
        <p className="text-[#3AABBB] font-semibold mt-1">{doctor.department}</p>
        {doctor.bio && (
          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {doctor.bio}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={() => navigate("/appointment")}
            className="bg-[#1B3C6B] text-white px-5 py-2.5 text-sm rounded-lg hover:bg-[#3AABBB] transition-colors duration-300"
          >
            Request an Appointment
          </button>
          <button
            onClick={() => navigate(`/doctors/${doctor._id}`)}
            className="bg-[#1B3C6B] text-white px-5 py-2.5 text-sm rounded-lg hover:bg-[#3AABBB] transition-colors duration-300"
          >
            View Doctor Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;