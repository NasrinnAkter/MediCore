import {
  getDoctorsService,
  getDoctorByIdService,
  createDoctorService,
  updateDoctorService,
  deleteDoctorService,
} from "../services/doctorService.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await getDoctorsService(req.query);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await getDoctorByIdService(req.params.id);
    res.json(doctor);
  } catch (error) {
    const status = error.message === "Doctor not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = await createDoctorService(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await updateDoctorService(req.params.id, req.body);
    res.json(doctor);
  } catch (error) {
    const status = error.message === "Doctor not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const result = await deleteDoctorService(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.message === "Doctor not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
