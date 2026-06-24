import Appointment from "../models/Appointment.js";

export const createAppointmentService = async (data) => {
  return await Appointment.create(data);
};

export const getAppointmentsService = async () => {
  return await Appointment.find()
    .populate("doctor", "name specialty department")
    .populate("patient", "name email")
    .sort({ date: -1 });
};

export const getMyAppointmentsService = async (userId) => {
  return await Appointment.find({ patient: userId })
    .populate("doctor", "name specialty department")
    .sort({ date: -1 });
};

export const updateAppointmentStatusService = async (id, status) => {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );
  if (!appointment) throw new Error("Appointment not found");
  return appointment;
};

export const cancelAppointmentService = async (id, userId) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) throw new Error("Appointment not found");

  if (appointment.patient?.toString() !== userId.toString()) {
    throw new Error("Not authorized to cancel this appointment");
  }

  appointment.status = "cancelled";
  await appointment.save();
  return appointment;
};

export const deleteAppointmentService = async (id) => {
  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) throw new Error("Appointment not found");
  return { message: "Appointment removed" };
};
