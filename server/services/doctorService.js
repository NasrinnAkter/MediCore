import Doctor from "../models/Doctor.js";

export const getDoctorsService = async ({
  search,
  department,
  specialty,
} = {}) => {
  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (department && department !== "All") {
    filter.department = { $regex: `^${department}$`, $options: "i" };
  }
  if (specialty) filter.specialty = { $regex: specialty, $options: "i" };

  return await Doctor.find(filter).sort({ createdAt: -1 });
};

export const getDoctorByIdService = async (id) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
};

export const createDoctorService = async (data) => {
  return await Doctor.create(data);
};

export const updateDoctorService = async (id, data) => {
  const doctor = await Doctor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
};

export const deleteDoctorService = async (id) => {
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new Error("Doctor not found");
  return { message: "Doctor removed" };
};
