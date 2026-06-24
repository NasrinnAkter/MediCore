import Service from "../models/Service.js";

export const getServicesService = async () => {
  return await Service.find().sort({ order: 1, createdAt: 1 });
};

export const getServiceByIdService = async (id) => {
  const service = await Service.findById(id);
  if (!service) throw new Error("Service not found");
  return service;
};

export const createServiceService = async (data) => {
  return await Service.create(data);
};

export const updateServiceService = async (id, data) => {
  const service = await Service.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new Error("Service not found");
  return service;
};

export const deleteServiceService = async (id) => {
  const service = await Service.findByIdAndDelete(id);
  if (!service) throw new Error("Service not found");
  return { message: "Service removed" };
};
