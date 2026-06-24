import DoctorCard from "./DoctorCard";

const DoctorGrid = ({ filtered = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filtered?.length === 0 ? (
        <p className="text-gray-500 text-center py-10 col-span-2">
          No doctors found.
        </p>
      ) : (
        filtered?.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))
      )}
    </div>
  );
};

export default DoctorGrid;
