import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUserService = async ({
  name,
  email,
  password,
  phone,
  dateOfBirth,
  bloodGroup,
}) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("Email already registered");

  const user = await User.create({
    name,
    email,
    password,
    phone,
    dateOfBirth,
    bloodGroup,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  };
};

export const getMeService = async (userId) => {
  return await User.findById(userId).select("-password");
};

export const updateProfileService = async (
  userId,
  { name, email, phone, dateOfBirth }
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, phone, dateOfBirth },
    { new: true, runValidators: true }
  ).select("-password");
  if (!user) throw new Error("User not found");
  return user;
};

export const changePasswordService = async (
  userId,
  { currentPassword, newPassword }
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = newPassword;
  await user.save();
  return { message: "Password updated successfully" };
};

export const getPatientsService = async () => {
  return await User.find({ role: "patient" })
    .select("-password")
    .sort({ createdAt: -1 });
};

export const getAdminStatsService = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalPatients, totalDoctors, todayAppointments, completedToday] =
    await Promise.all([
      User.countDocuments({ role: "patient" }),
      Doctor.countDocuments(),
      Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow },
        status: "completed",
      }),
    ]);

  return { totalPatients, totalDoctors, todayAppointments, completedToday };
};

export const getPatientStatsService = async (userId) => {
  const now = new Date();

  const upcoming = await Appointment.countDocuments({
    patient: userId,
    date: { $gte: now },
    status: { $in: ["pending", "confirmed"] },
  });

  const past = await Appointment.countDocuments({
    patient: userId,
    $or: [
      { date: { $lt: now } },
      { status: { $in: ["completed", "cancelled"] } },
    ],
  });

  const pending = await Appointment.countDocuments({
    patient: userId,
    status: "pending",
  });

  return { upcoming, past, pending };
};