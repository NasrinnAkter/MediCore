import {
  createAppointmentService,
  getAppointmentsService,
  getMyAppointmentsService,
  updateAppointmentStatusService,
  cancelAppointmentService,
  deleteAppointmentService,
} from "../services/appointmentService.js";

export const createAppointment = async (req, res) => {
  try {
    // 🚫 Block admin from booking appointments
    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "Admin accounts are not allowed to book appointments.",
      });
    }

    const appointment = await createAppointmentService({
      ...req.body,
      patient: req.user._id,
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await getAppointmentsService();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await getMyAppointmentsService(req.user._id);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await updateAppointmentStatusService(
      req.params.id,
      req.body.status,
    );
    res.json(appointment);
  } catch (error) {
    const status = error.message === "Appointment not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await cancelAppointmentService(
      req.params.id,
      req.user._id,
    );
    res.json(appointment);
  } catch (error) {
    const status = error.message.includes("not found")
      ? 404
      : error.message.includes("Not authorized")
        ? 403
        : 500;
    res.status(status).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const result = await deleteAppointmentService(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error.message === "Appointment not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};